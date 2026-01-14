import { rootQueryUrl, allVendingMachinesEndpoint } from "~/root";
import { apiGet } from "~/api/api";
import type { VendingMachine } from "~/interfaces";
import { apiGet } from "~/api/api";

export let useGetAllVendingMachines = () =>
<<<<<<< HEAD
  useQuery<VendingMachine[]>({
    queryKey: ["vending_machines"],
    queryFn: () => apiGet<VendingMachine[]>(`${rootQueryUrl}/${allVendingMachinesEndpoint}`),
  });
  
=======
    apiGet<VendingMachine[]>("vending_machines", `${rootQueryUrl}/${allVendingMachinesEndpoint}`);
>>>>>>> 03cea27 (Update apiGet to use tanstack)
