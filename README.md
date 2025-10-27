# Frontend for our app built with React

## Development
### Install bun for faster development
The bun runtime repo is available [here](https://github.com/oven-sh/bun).

_Note_: if you run into issues, all of the below `bun` commands should be interchangeable with `npm`.


#### Install dependencies:
```bash
bun install
```

Start the development server with Hot Module Replacement:

```bash
bun run dev
```

Create a production build:

```bash
bun run build
```

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container, format is HOST_PORT:CONTAINER_PORT
docker run -p 3000:3000 my-app
```

## Structure
The project's directory structure is essentially using React Router's `create-react-router@latest` template ([more info here](https://reactrouter.com/tutorials/quickstart)).

## Styling
We use `shadcn` components as the base for our own components (they have accessibility features ready and are easily extensible). Their website [is here](https://ui.shadcn.com).

We also use `tailwindcss`. For color styling within shadcn, we use CSS variables and so `tailwind.cssVariables` is set to `true` in `components.json`.

## Meta-framework
Vite has been chosen as the meta-framework for this project. It integrates well with React Router, which we also use.

### Internal
#### Structure hints
The directories that make up the project shold have their own `README.md` files 
inside of them. These can be filled with brief hints as to what can/should be
placed in each directory.

#### VS Code development
The following extensions are used within VS Code for React development:
```
dbaeumer.vscode-eslint
```

#### Testing in Playwright
Aside from the unit tests found in `src/tests`, we would like to control regression with fully-fleged, automated end-to-end tests. For this purpose, `Playwright` paired with `pytest` seem to be a natural choice.

Your Python .venv can be made inside the root directory `./` or directly above it `./..` - make sure you install the requirements inside of `playwright_tests/requirements.txt` by executing:
```bash
(.venv) ~/my_git_projects/react_frontend 
$: pip install -r playwright_tests/requirements.txt
```

**The (.venv) part of the prompt suggests you have your .venv's Python interpreter activated with**
```bash
source ./react_frontend/bin/activate
```
