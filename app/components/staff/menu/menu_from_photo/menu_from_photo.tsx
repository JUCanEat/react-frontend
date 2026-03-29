import React, { useEffect } from 'react';
import { TopBar } from '~/components/shared/top_bar';
import { useKeycloak } from '@react-keycloak/web';
import { useNavigate } from 'react-router-dom';
import { menuService } from '~/api/menu_service';
import { LoadingSpinner } from '~/components/staff/common/loading_spinner';
import { MenuUploadSection } from '~/components/staff/menu/menu_from_photo/menu_upload_section';
import { CategoryGrid } from '~/components/staff/menu/menu_from_photo/category_grid';
import { Button } from '~/shadcn/components/ui/button';
import { useTranslation } from 'react-i18next';
import { menuRoutes } from '~/components/staff/menu/menu_routes';

interface StaffMenuFromPhotoProps {
  restaurantId: string;
}

export function StaffMenuFromPhoto({ restaurantId }: StaffMenuFromPhotoProps) {
  const { keycloak } = useKeycloak();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [uploading, setUploading] = React.useState(false);
  const [processing, setProcessing] = React.useState(false);

  useEffect(() => {
    if (!processing || !keycloak.token) return;

    const interval = setInterval(async () => {
      try {
        await menuService.getMenuDraft(restaurantId, keycloak.token!);
        setProcessing(false);
        clearInterval(interval);
        navigate(menuRoutes.staffDrafts(restaurantId));
      } catch (error) {
        console.log('Draft not ready yet, checking again in 3s...');
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [processing, keycloak.token, restaurantId, navigate]);

  const handleUploadImage = async (file: File) => {
    if (!keycloak.token) {
      alert(t('staff.notLoggedIn'));
      return;
    }

    setUploading(true);

    try {
      await menuService.uploadMenuImage(restaurantId, file, keycloak.token);
      setUploading(false);
      setProcessing(true);
    } catch (error) {
      console.error('Upload failed:', error);
      alert(t('staff.uploadFailed', { error: String(error) }));
      setUploading(false);
    }
  };

  if (processing || uploading) {
    return (
      <LoadingSpinner
        message={uploading ? t('staff.uploadingImage') : t('staff.processingWithAi')}
        subMessage={t('staff.thisMayTakeMoments')}
        size="lg"
        fullScreen
        darkBackground
      />
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-white dark:bg-black">
      <TopBar isLoginPage={false} />
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center justify-center w-full max-w-md px-4 pt-6 pb-24">
          <Button
            variant="outline"
            className="mb-6 w-fit bg-white text-gray-900 hover:bg-zinc-100 dark:bg-white dark:text-white dark:hover:bg-blue-900/20"
            onClick={() => navigate(-1)}
          >
            ← {t('common.goBack')}
          </Button>
          <MenuUploadSection onFileSelect={handleUploadImage} />
        </div>
      </div>
    </div>
  );
}
