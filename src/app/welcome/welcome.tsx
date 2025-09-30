import {
  QueryClient,
  QueryClientProvider,
  useQuery
} from '@tanstack/react-query'

const queryClient = new QueryClient()

export function Welcome() {  
  return (
    <QueryClientProvider client={queryClient}>
      <HelloWorld />
    </QueryClientProvider>
  );
}

function HelloWorld() {
  const { isPending, error, data } = useQuery({
    queryKey: ["ExampleCLass"],
    queryFn: () =>
      fetch("http://127.0.0.1:8080/hello/example").then((res) => 
        res.json(),
    ),
  })

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  let unpacked_data = data[0]

  return (
    <div>
      <h1>exampleField:</h1>
      <h2>{unpacked_data.exampleField}</h2>
    </div>
  )
}