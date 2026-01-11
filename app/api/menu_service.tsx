<<<<<<< HEAD
import { useQuery } from "@tanstack/react-query";
import { rootQueryUrl, menusEndpoint } from "~/root";
import { apiGet } from "~/api/api";
import type { DailyMenu } from "~/interfaces";

export const useGetDailyMenu = (restaurantId: string) =>
  useQuery<DailyMenu>({
    queryKey: ["dailyMenu", restaurantId],
    queryFn: () => apiGet<DailyMenu>(`${rootQueryUrl}/${menusEndpoint}/${restaurantId}`),
});
=======
// // app/api/menu_service.tsx
// import { useMutation } from "@tanstack/react-query";
// import { rootQueryUrl, menusEndpoint } from "~/root";
//
// // Co musimy wysłać, żeby backend był szczęśliwy
// type UploadMenuImageArgs = {
//     restaurantId: string;
//     file: File;
// };
//
// // Funkcja, która faktycznie robi HTTP POST na backend
// async function uploadMenuImageRequest({
//                                           restaurantId,
//                                           file,
//                                       }: UploadMenuImageArgs): Promise<void> {
//     const formData = new FormData();
//     formData.append("restaurantId", restaurantId);
//     formData.append("image", file);
//
//     // NA RAZIE prosto: token z localStorage.
//     // Jak masz auth inaczej, później to zmienimy.
//     const token = localStorage.getItem("access_token") ?? "";
//
//     const res = await fetch(`${rootQueryUrl}/${menusEndpoint}`, {
//         method: "POST",
//         headers: token
//             ? {
//                 Authorization: `Bearer ${token}`,
//             }
//             : undefined,
//         body: formData,
//     });
//
//     if (!res.ok) {
//         const text = await res.text().catch(() => "");
//         throw new Error(`Upload failed (${res.status}): ${text}`);
//     }
// }
//
// // Hook w stylu useGetAllRestaurants – ale do mutacji (wysyłania danych)
// export function useUploadMenuImage() {
//     return useMutation({
//         mutationFn: uploadMenuImageRequest,
//     });
// }
>>>>>>> 21f9d6a35b32dc75e64590f880d5c34a571c2446
