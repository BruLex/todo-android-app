import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { registerElement } from '@nativescript/angular';
import { ImageAsset } from '@nativescript/core';
import { FilePhotoview } from 'nativescript-file-photoview';
import * as imagepicker from 'nativescript-imagepicker';
import { ImagePicker, ImagePickerMediaType } from 'nativescript-imagepicker';
import { clear, getString, setString } from 'tns-core-modules/application-settings';
import { confirm } from 'tns-core-modules/ui/dialogs';
import * as utils from 'tns-core-modules/utils/utils';
import { AppService } from '~/app.service';
import { Todo } from '~/types';
import * as camera from '../library/nativescript-camera';

registerElement('ImageSwipe', () => require('nativescript-image-swipe/image-swipe').ImageSwipe);

@Component({
    templateUrl: './add-edit-todo.component.html',
})
export class AddEditTodoComponent {
    isAdd: boolean = true;
    utils: typeof utils = utils;
    filePhotoView: FilePhotoview = new FilePhotoview();
    todo: Todo = { id: null, body: '', title: '', imagesPaths: [] };

    isSaving: boolean = false;

    get images(): string[] {
        return (this.todo && this.todo.imagesPaths) || [];
    }

    constructor(private route: ActivatedRoute, private router: Router, private appSrv: AppService) {
        if (!getString('mode') || (getString('mode') === 'edit' && !getString('id'))) {
            this.initCommon();
        } else {
            this.restoreData();
        }
    }

    initCommon(): void {
        clear();
        this.appSrv.clearCacheFolder();
        this.route.data.subscribe((data): void => {
            const mode: 'add' | 'edit' = data['mode'];
            this.isAdd = mode === 'add';
            if (this.isAdd) {
                setString('mode', mode);
            } else {
                this.route.params.subscribe(param => {
                    console.log(param);
                    if (!!param && !!param['id']) {
                        this.todo = this.appSrv.todos.find(v => Number(v.id) === Number(param['id']));
                    }
                });
            }
        });
    }

    restoreData(): void {
        if (getString('mode') === 'edit') {
            this.isAdd = false;
            const todo: Todo = this.appSrv.todos.find(v => Number(v.id) === Number(Number(getString('id'))));
            console.log(getString('id'));
            console.log(this.appSrv.todos);
            console.log(todo);
            this.appSrv.copyCacheToDirectory(this.todo.id);
            this.appSrv.clearCacheFolder();
            this.appSrv.fetchFilesById(this.todo.id);
        } else {
            this.isAdd = true;
            this.todo.title = getString('title') || '';
            this.todo.body = getString('body') || '';
            this.todo.imagesPaths.push(...this.appSrv.getAllCachedFiles());
        }
    }

    takePicture(): void {
        if (!this.isAdd) {
            setString('mode', 'add');
            setString('id', `${ this.todo.id }`);
        }
        camera.requestPermissions().then(
            () => {
                const filename: string = `${ this.appSrv.uniqueID() }.jpg`;
                camera
                    .takePicture({
                        saveToGallery: false,
                        saveAppPath: this.appSrv.cacheImageFolder,
                        fileName: filename,
                    })
                    .then(imageAsset => {
                        if (this.isAdd) {
                            this.todo.imagesPaths.push(imageAsset.android);
                        } else {
                            this.todo.imagesPaths.push(...this.appSrv.addImages(this.todo.id, [imageAsset]));
                        }
                    })
                    .catch(err => {
                        console.log('Error -> ' + err.message);
                    });
            },
            err => {
                console.log('Error -> ' + err.message);
            }
        );
    }

    deleteImage(index: number): void {
        confirm('Delete image?').then(result => {
            if (result) {
                this.appSrv.removeFilesByPath(this.images[index]);
                this.images.splice(index, 1);
            }
        });
    }

    onImageAdd(): void {
        const context: ImagePicker = imagepicker.create({
            mode: 'multiple',
            mediaType: ImagePickerMediaType.Image,
        });
        context
            .authorize()
            .then((): Promise<ImageAsset[]> => context.present())
            .then(selection => {
                if (this.isAdd) {
                    this.todo.imagesPaths.push(...this.appSrv.saveFilesToCache(selection));
                } else {
                    this.todo.imagesPaths.push(...this.appSrv.addImages(this.todo.id, selection));
                }
            });
    }

    onSave(): void {
        this.isSaving = true;
        this.appSrv.insert(this.todo.title, this.todo.body).subscribe((id): void => {
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
            this.appSrv.update(this.todo.id, this.todo.title, this.todo.body).subscribe();
        } else {
            setString('body', this.todo.body);
            setString('title', this.todo.title);
        }
    }
}
