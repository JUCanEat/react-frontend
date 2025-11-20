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

To build and run using Docker:
```bash
docker build -t my-app .

# Run the container, format is HOST_PORT:CONTAINER_PORT
docker run -p 3000:3000 my-app
```

## Help
#### My IDE is highlighting my imported Route type with an error!
If you have an import that is similar to the below example:
```typescript
import type { Route } from "./+types/mainui";
```
and it is underlined in red by your IDE as being incorrect, try running:
```
react-router typegen
```
and also try figuring out how the import should look by checking out `.react-router`.
More on this [at this useful React Router type generation page](https://reactrouter.com/explanation/type-safety).

#### How should I use QueryClient for Tanstack Query?
To the best of my knowledge, it should be wrapped most-externally around a single route. So suppose you have:
```typescript
export default [
    layout("./routes/mainui.tsx", [
        index("routes/overview.tsx"),
        route("restaurants/:restaurantId","routes/restaurant.tsx")
    ]),
    route("profile","routes/profile.tsx"),
] satisfies RouteConfig;
```
then we consider `./routes/mainui.tsx` and `./routes/profile.tsx` to each be a 'single route'. For each corresponding
`.tsx` file under `./app/routes`, we include the QueryClient as such:
```typescript
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()
...

export default function MainUI() {
    return (
        <QueryClientProvider client={queryClient}>
            <Outlet /> 
        </QueryClientProvider>
    );
}
```
In the above sense, `QueryClientProvider` wraps "most-externally" around `<Outlet />`.

## Structure
### Core
The project's directory structure is essentially using React Router's `create-react-router@latest` template ([more info here](https://reactrouter.com/tutorials/quickstart)).

### Ours
The workflow is essentially this:
1. `~/routes.ts` determines routes.
2. The routes are found under `~/routes`. These `.tsx` files correspond to pages/nested pages.
3. The pages would ideally be easily composable with fully-built components.
4. A fully-built component should have their own folder in `./app`, eg. `~/map`, `~/overview`.
5. Fully-built components should be built in a hierarchical manner (check out [this](https://react.dev/learn/thinking-in-react))
by using smaller components.
6. The smaller components, which can theoretically be reused (but will probably most often be used to inspire the creation 
of new components) live under `~/components`.

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
