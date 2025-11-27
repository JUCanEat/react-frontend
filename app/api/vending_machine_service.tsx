import { useQuery } from "@tanstack/react-query";
import { rootQueryUrl, allVendingMachinesEndpoint } from "~/root";
import type { VendingMachine } from "~/interfaces";

export let useGetAllVendingMachines = () =>
  useQuery<VendingMachine[]>({
    queryKey: ["vending_machines"],
    queryFn: async () => {
      const res = await fetch(`${rootQueryUrl}/${allVendingMachinesEndpoint}`);
      if (!res.ok) throw new Error("Failed to fetch vending machines");
      return res.json();
    },
  });
