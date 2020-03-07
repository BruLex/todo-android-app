import { Component, } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { ImageAsset, knownFolders, path } from "@nativescript/core";
import { registerElement } from "nativescript-angular/element-registry";
import * as camera from "../library/nativescript-camera";
import { exit } from "nativescript-exit";
import { FilePhotoview } from "nativescript-file-photoview";
import * as imagepicker from "nativescript-imagepicker";
import { ImagePicker, ImagePickerMediaType } from "nativescript-imagepicker";
import { confirm } from "tns-core-modules/ui/dialogs";
import * as utils from "tns-core-modules/utils/utils";
import { AppService } from "~/app.service";


import { clear, getString, setString } from "tns-core-modules/application-settings";
import { ComponentCanDeactivate } from "~/main.guard";

registerElement("ImageSwipe", () => require("nativescript-image-swipe/image-swipe").ImageSwipe);

@Component({
    templateUrl: "./add-edit-todo.component.html",
    styleUrls: ['./add-edit-todo.component.css'],
})
export class AddEditTodoComponent implements ComponentCanDeactivate {

    isAdd: boolean = true;
    utils: typeof utils = utils;
    exit: typeof exit = exit;
    title: string = '';
    body: string = '';
    items: string[] = [];
    filePhotoView: FilePhotoview = new FilePhotoview();
    editId: number = null;
    isSaving: boolean = false;

    get images(): string[] {
        return ((this.isAdd ? this.items : this.editId && this.appSrv.todos[this.editId].imagesPaths) || []).filter();
    }

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private appSrv: AppService
    ) {
        if (!getString("mode")) {
            this.initCommon();
        } else {
            this.restoreData();
        }
    }

    canDeactivate() : boolean {
        console.log('canDeactivate');
        clear();
        this.appSrv.clearCacheFolder();
        return true;
    }

    initCommon(): void {
        clear();
        this.route.data.subscribe((data): void => {
                const mode: 'add' | 'edit' = data['mode'];
                console.log('mode: ', mode);
                console.log('datas: ', data);
                this.isAdd = mode === 'add';
                if (this.isAdd) {
                    setString("mode", "add");
                }
        });

        this.route.params.subscribe(param => {
            if (!!param && !!param['id']) {
                this.editId = this.route.root.firstChild.snapshot.params['id'];
                this.title = this.appSrv.todos[this.editId].title;
                this.body = this.appSrv.todos[this.editId].body;
            }
        })
    }

    restoreData(): void {
        if (getString("mode") === 'add') {
            this.isAdd = true;
            this.editId = Number(getString("id"));
            this.title = this.appSrv.todos[this.editId].title;
            this.body = this.appSrv.todos[this.editId].body;
            this.appSrv.copyCacheToDirectory(this.editId);
            this.appSrv.clearCacheFolder();
            this.appSrv.fetchFilesById(this.editId);
        } else {
            // restore all field data
            this.isAdd = false;
            this.title = getString("title") || '';
            this.body = getString("body") || '';
            this.items.push(...this.appSrv.getAllCachedFiles());
        }
    }

    takePicture(): void {
        if (!this.isAdd) {
            setString("mode", 'add');
            setString("id", `${ this.editId }`);
        }
        this.appSrv.clearCacheFolder();
        camera.requestPermissions().then(
            () => {
                camera.takePicture({
                        saveToGallery: false,
                        saveAppPath: path.join(knownFolders.currentApp().path, 'images'),
                        fileName: `${this.appSrv.uniqueID()}.jpg`,
                    })
                    .then((imageAsset) => {
                        if (this.isAdd) {
                            this.items.push(...this.appSrv.saveFilesToCache(imageAsset));
                        } else {
                            this.appSrv.addImages(this.appSrv.todos[this.editId].id, [imageAsset]);
                        }
                    }).catch((err) => {
                    console.log("Errosr -> " + err.message);
                });
            },
            (err) => {
                console.log("Error -> " + err.message);
            }
        );

    }

    deleteImage(index: number): void {
        confirm("Delete image?").then(result => {
            if (result) {
                this.appSrv.removeFilesByPath(this.images[index]);
                this.images.splice(index, 1);
            }
        });
    }

    onImageAdd(): void {
        console.log('isAdd', this.isAdd);
        const context: ImagePicker = imagepicker.create({
            mode: "multiple",
            mediaType: ImagePickerMediaType.Image,
        });
        context
            .authorize().then((): Promise<ImageAsset[]> => context.present())
            .then(selection => {
                console.log('isAdd', this.isAdd);
                if (this.isAdd) {
                    this.items.push(...this.appSrv.saveFilesToCache(selection));
                } else {
                    this.appSrv.addImages(this.appSrv.todos[this.editId].id, selection);
                }
            });
    }

    onSave(): void {
        this.isSaving = true;
        this.appSrv.insert(this.title, this.body).subscribe((id): void => {
            if (id) {
                this.appSrv.copyCacheToDirectory(id);
                this.router.navigate(['/']);
                this.isSaving = false;
                clear();
                this.appSrv.clearCacheFolder();
            }
        });
    }

    showImage(item: ImageAsset | string): void {
        this.filePhotoView.show(typeof item === 'string' ? item : item.android);
    }

    saveFields(): void {
        if (!this.isAdd) {
            this.appSrv.update(this.appSrv.todos[this.editId].id, this.title, this.body).subscribe();
        } else {
            setString("body", this.body);
            setString("title", this.title);
        }
    }
}
