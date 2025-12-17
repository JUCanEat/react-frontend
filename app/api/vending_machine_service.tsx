import { useQuery } from "@tanstack/react-query";
import { rootQueryUrl, allVendingMachinesEndpoint } from "~/root";
import type { VendingMachine } from "~/interfaces";
import { apiGet } from "~/api/api";

export let useGetAllVendingMachines = () =>
  useQuery<VendingMachine[]>({
    queryKey: ["vending_machines"],
    queryFn: () => apiGet<VendingMachine[]>(`${rootQueryUrl}/${allVendingMachinesEndpoint}`),
  });
  
