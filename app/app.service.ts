import { Injectable } from '@angular/core';
import { ImageAsset } from '@nativescript/core';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/internal/operators';
import { File, Folder, knownFolders, path } from 'tns-core-modules/file-system';
import { ImageSource } from 'tns-core-modules/image-source';
import { alert } from 'tns-core-modules/ui/dialogs';
import { ad } from 'tns-core-modules/utils/utils';
import { Todo } from '~/types';
// tslint:disable-next-line:variable-name
const Sqlite: any = require('nativescript-sqlite');

@Injectable({
    providedIn: 'root',
})
export class AppService {
    readonly cacheImageFolder: string = path.join(
        ad
            .getApplicationContext()
            .getExternalFilesDir(null)
            .getAbsolutePath(),
        'images'
    );
    databaseReady: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    todos: Todo[] = [];
    private database: any;
    private rootImageFolder: string = path.join(knownFolders.currentApp().path, 'images');

    constructor() {
        new Sqlite('todos.db').then(
            (db): void => {
                // db.execSQL("DROP TABLE todos");
                db.execSQL(
                    'CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, body TEXT)'
                ).then(
                    id => {
                        this.database = db;
                        // this.fetch();
                        this.databaseReady.next(true);
                        console.log('CREATE TABLE SUCCESS');
                    },
                    (error): void => {
                        const message: string = 'CREATE TABLE ERROR' + error;
                        alert(message);
                        console.log(message);
                    }
                );
            },
            (error): void => {
                const message: string = 'OPEN DB ERROR' + error;
                alert(message);
                console.log(message);
            }
        );

        if (!Folder.exists(this.rootImageFolder)) {
            Folder.fromPath(this.rootImageFolder);
        }
    }

    insert(title: string, body: string): Observable<number> {
        return from(this.database.execSQL('INSERT INTO todos (title, body) VALUES (?,?)', [title, body])).pipe(
            map((id: number) => {
                console.log('INSERT RESULT', id);
                this.fetch();
                return id;
            }),
            catchError(error => {
                const message: string = 'INSERT ERROR' + error;
                alert(message);
                console.log(message);
                return of(null);
            })
        );
    }

    update(id: number, title: string, body: string): Observable<boolean> {
        return from(this.database.execSQL('UPDATE todos set title = ?, body = ? WHERE id=?', [title, body, id])).pipe(
            map((): boolean => {
                console.log('UPDATE SUCCESS RESULT');
                this.fetch();
                return true;
            }),
            catchError(
                (error): Observable<boolean> => {
                    const message: string = 'UPDATE ERROR' + error;
                    alert(message);
                    console.log(message);
                    return of(false);
                }
            )
        );
    }

    fetch(): void {
        this.database.all('SELECT * FROM todos').then(
            (rows): void => {
                this.todos = rows.map(row => ({
                    id: row[0],
                    title: row[1],
                    body: row[2],
                    imagesPaths: [],
                }));
                this.fetchAllFiles();
            },
            (error): void => {
                const message: string = 'SELECT  ERROR' + error;
                alert(message);
                console.log(message);
            }
        );
    }

    fetchFilesById(id: string | number): void {
        const todo: Todo = this.todos.find(v => Number(v.id) === Number(id));
        if (todo) {
            todo.imagesPaths = Folder.fromPath(path.join(this.rootImageFolder, String(id)))
                .getEntitiesSync()
                .map(img => img.path);
        }
    }

    fetchAllFiles(): void {
        this.todos.forEach(
            item =>
                (item.imagesPaths = Folder.fromPath(path.join(this.rootImageFolder, item.id.toString()))
                    .getEntitiesSync()
                    .map(img => img.path))
        );
    }

    remove(id: number): Observable<boolean> {
        return from(this.database.execSQL('DELETE FROM todos WHERE id = ?', [id])).pipe(
            map((val): boolean => !!val),
            catchError(
                (error): Observable<boolean> => {
                    const message: string = 'UPDATE ERROR' + error;
                    alert(message);
                    console.log(message);
                    return of(false);
                }
            )
        );
    }

    removeFilesByPath(path: string): void {
        File.fromPath(path).removeSync();
    }

    removeImageFolder(id: string | number): void {
        Folder.fromPath(path.join(this.rootImageFolder, id.toString())).remove();
    }

    saveFilesToCache(data: ImageAsset | ImageAsset[]): string[] {
        const imagesAssets: ImageAsset[] = Array.isArray(data) ? data : [data];
        console.log(imagesAssets);
        return imagesAssets.map(asset => {
            const fileName: string = this.uniqueID() + '.png';
            const filePath: string = path.join(this.cacheImageFolder, fileName);
            from(ImageSource.fromAsset(asset)).subscribe(
                (imageSource: ImageSource): void => {
                    Folder.fromPath(this.cacheImageFolder);
                    const saved: boolean = imageSource.saveToFile(filePath, 'png', 50);
                    if (saved) {
                        console.log('Image cached successfully!');
                    }
                },
                e => {
                    const message: string = 'Ersror: : ' + e;
                    alert(message);
                    console.log(message);
                }
            );
            return filePath;
        });
    }

    clearCacheFolder(): void {
        Folder.fromPath(this.cacheImageFolder).remove();
    }

    getAllCachedFiles(): string[] {
        return Folder.fromPath(this.cacheImageFolder)
            .getEntitiesSync()
            .map(o => o.path);
    }

    copyCacheToDirectory(id: number | string): void {
        this.getAllCachedFiles().forEach(cachePath => {
            const folderPath: string = path.join(this.rootImageFolder, id.toString());
            const fileName: string = this.uniqueID() + '.png';
            const filePath: string = path.join(folderPath, fileName);
            File.fromPath(filePath).writeSync(File.fromPath(cachePath).readSync());
        });
    }

    addImages(id: number | string, files: ImageAsset[]): string[] {
        const folderPath: string = path.join(this.rootImageFolder, id.toString());
        Folder.fromPath(folderPath);
        return files.map(file => {
                const fileName: string = this.uniqueID() + '.png';
                const filePath: string = path.join(folderPath, fileName);
                from(ImageSource.fromAsset(file)).subscribe(
                    (imageSource: ImageSource): void => {
                        const saved: boolean = imageSource.saveToFile(filePath, 'png', 50);
                        if (saved) {
                            console.log('Image saved successfully!');
                        }
                        this.fetch();
                    },
                    e => {
                        const message: string = 'Ersror: : ' + e;
                        alert(message);
                        console.log(message);
                    }
                );
                return filePath;
            }
        );
    }

    uniqueID(): string {
        const random4UUID: () => string = (): string =>
            Math.random()
                .toString(32)
                .replace('.', '')
                .split('')
                .sort((): number => Math.random() - 0.5)
                .join('')
                .slice(-4);
        return (
            random4UUID() +
            random4UUID() +
            '-' +
            random4UUID() +
            '-' +
            random4UUID() +
            '-' +
            random4UUID() +
            '-' +
            random4UUID() +
            random4UUID() +
            random4UUID()
        );
    }
}
