# Frontend for our app built with React

## Structure
The project's directory structure is heavily inspired [by this guide](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md).
Directories are added/removed on an "as-needed" basis.

## Meta-framework
Vite has been chosen as the meta-framework for this project due to it 
appearing relatively frequently as a suggestion (while reading various guides).

### Internal
#### Structure hints
The directories that make up the project have their own `README.md` files 
inside of them. These are filled with brief hints as to what can/should be
placed in each directory. These are inspired [by this website post](https://www.thatsoftwaredude.com/content/14110/creating-a-good-folder-structure-for-your-vite-app).

#### VS Code development
Beginning with the initial project structure PR, the following extensions were
used inside of VS Code for the React development part:
```
xabikos.javascriptsnippets
ritwickdey.liveserver
esbenp.prettier-vscode
```

#### Testing in Playwright
Aside from the unit tests found in `src/tests`, we would like to control regression with fully-fleged, automated end-to-end tests. For this purpose, `Playwright` paired with `pytest` seem to be a natural choice.

Your Python .venv can be made inside the root directory `./` or directly above it `./..` - make sure you install the requirements inside of `playwright_tests/requirements.txt` by executing:
```
(.venv) ~/my_git_projects/react_frontend 
$: pip install -r playwright_tests/requirements.txt
```

**The (.venv) part of the prompt suggests you have your .venv's Python interpreter activated with**
```
source ./react_frontend/bin/activate
```