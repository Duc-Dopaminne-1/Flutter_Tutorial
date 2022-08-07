# Noir Caesar Mobile
Root repository for Noir Caesar Mobile. Contain react native app stater and modules for dev.

### Installation
+ Clone project
    ```
    git clone git@gitlab.com:goldfish-projects/noir-caesar-mobile.git
    ```
+ Pull latest of all git submodules
    - In the first time
        ```
        git submodule update --init --recursive
        ```
    - Not the first time
        ```
        git submodule update --recursive
        ```

+ ***For Dev*** Install dependencies for watch node process, run from root folder
    ```
    yarn or npm install
    ```

### Folder Structure
![Folder Structure](docs/folder-structure.png)
+ ***app*** - contain repository of react native app starter
+ ***modules*** - contain all modules to included from app
+ ***`__DEV__`*** - develop folder contain temporary app project for development. In first time you will need create this folder and copy all source from ***app*** folder

### DEV
+ Import package to `__DEV__/package.json` with npm local package
    ```
    {
        ...,
        dependencies: {
            ...,
            @hd/packageName: 'file:../modules/packageName',
        }
    }
    ```
+ Run install from `__DEV__`:
    ```
    yarn or npm install
    ```
+ Run watch node process from root folder to sync module from `modules/moduleName` with `__DEV__/node_modules/moduleName`
    ```
    node .
    ```
### Localize
+ Folder: `./src/localize`
+ Add a new language:
    - Add a new json file to folder `./src/localize/languages`
    - In `./src/localize/index.ts` import the new file and add it to translations
+ Add error code:
    - In `./src/constants/errorCode.ts`, add new error code key
+ Translate text:
    - `translate('news_feed.news_feed')`
+ Translate error code:
    - `translate(key[errorText] ? key[errorText] : key[defaultError])`
