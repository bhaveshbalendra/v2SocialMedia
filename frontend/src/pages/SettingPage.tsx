import { Icons } from "@/components/export/Icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch } from "@/hooks/redux/useAppDispatch";
import useSettings from "@/hooks/settings/useSettings";
import {
  useUpdateNotificationsMutation,
  useUpdatePrivacyMutation,
} from "@/store/apis/settingsApi";
import {
  setNotificationEmail,
  setNotificationPush,
  setPrivacy,
} from "@/store/slices/settingsSlice";

const SettingPage = () => {
  const dispatch = useAppDispatch();
  const { userSettings, isLoading, error } = useSettings();
  const { privacyAndSecurity, notifications } = userSettings;

  // API mutations
  const [updatePrivacy, { isLoading: isUpdatingPrivacy }] =
    useUpdatePrivacyMutation();
  const [updateNotifications, { isLoading: isUpdatingNotifications }] =
    useUpdateNotificationsMutation();

  // Handle privacy toggle
  const handlePrivacyToggle = async () => {
    try {
      // Call the API to update privacy
      await updatePrivacy({ isPrivate: !privacyAndSecurity.isPrivate });
      // Update local state
      dispatch(setPrivacy(!privacyAndSecurity.isPrivate));
    } catch (error) {
      console.error("Failed to update privacy setting:", error);
    }
  };

  // Handle email notifications toggle
  const handleEmailNotificationsToggle = async () => {
    try {
      // Call the API to update notification settings
      await updateNotifications({ email: !notifications.email });
      // Update local state
      dispatch(setNotificationEmail(!notifications.email));
    } catch (error) {
      console.error("Failed to update email notifications:", error);
    }
  };

  // Handle push notifications toggle
  const handlePushNotificationsToggle = async () => {
    try {
      // Call the API to update notification settings
      await updateNotifications({ push: !notifications.push });
      // Update local state
      dispatch(setNotificationPush(!notifications.push));
    } catch (error) {
      console.error("Failed to update push notifications:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Icons.Spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto py-6 px-4">
        <div className="bg-red-100 p-4 rounded-md">
          <p className="text-red-800">
            Error loading settings. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <Tabs defaultValue="privacy">
        <TabsList className="mb-6">
          <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="privacy">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Privacy</CardTitle>
              <p className="text-sm text-muted-foreground">
                Control how your account and content is viewed by others
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Private Account</p>
                  <p className="text-sm text-muted-foreground">
                    When your account is private, only people you approve can
                    see your content
                  </p>
                </div>
                <Button
                  variant={
                    privacyAndSecurity?.isPrivate ? "default" : "outline"
                  }
                  onClick={handlePrivacyToggle}
                  disabled={isUpdatingPrivacy}
                >
                  {isUpdatingPrivacy ? (
                    <Icons.Spinner className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {privacyAndSecurity?.isPrivate ? "Private" : "Public"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure how you receive notifications
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Button
                  variant={notifications?.email ? "default" : "outline"}
                  onClick={handleEmailNotificationsToggle}
                  disabled={isUpdatingNotifications}
                >
                  {notifications?.email ? "Enabled" : "Disabled"}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications on your device
                  </p>
                </div>
                <Button
                  variant={notifications?.push ? "default" : "outline"}
                  onClick={handlePushNotificationsToggle}
                  disabled={isUpdatingNotifications}
                >
                  {notifications?.push ? "Enabled" : "Disabled"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <p className="text-sm text-muted-foreground">
                Update your profile information
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Profile settings coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingPage;
