import { rootQueryUrl, allVendingMachinesEndpoint } from "~/root";
import { apiGet } from "~/api/api";
import type { VendingMachine } from "~/interfaces";

export let useGetAllVendingMachines = () =>
    apiGet<VendingMachine[]>("vending_machines", `${rootQueryUrl}/${allVendingMachinesEndpoint}`);