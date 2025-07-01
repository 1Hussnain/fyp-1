
import React, { useState } from "react";
import { motion } from "framer-motion";
import AppLayout from "../components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "@/components/ui/sonner";
import { User, Bell, Shield, Palette, Database, HelpCircle } from "lucide-react";

const Settings = () => {
  const { user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [budgetAlerts, setBudgetAlerts] = useState(true);

  const handleSaveProfile = () => {
    toast.success("Profile updated successfully!");
  };

  const handleSaveNotifications = () => {
    toast.success("Notification preferences saved!");
  };

  const handleExportData = () => {
    toast.success("Data export initiated. You'll receive an email when ready.");
  };

  return (
    <AppLayout pageTitle="Settings">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="text-center py-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-600 to-gray-600 bg-clip-text text-transparent mb-2">
                Account Settings
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Manage your account preferences and privacy settings
              </p>
            </div>

            {/* Settings Tabs */}
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <Tabs defaultValue="profile" className="w-full">
                  <TabsList className="grid w-full grid-cols-5 mb-8 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                    <TabsTrigger value="profile" className="rounded-lg flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Profile
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="rounded-lg flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Notifications
                    </TabsTrigger>
                    <TabsTrigger value="appearance" className="rounded-lg flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      Appearance
                    </TabsTrigger>
                    <TabsTrigger value="privacy" className="rounded-lg flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Privacy
                    </TabsTrigger>
                    <TabsTrigger value="data" className="rounded-lg flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      Data
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="profile" className="space-y-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input 
                            id="firstName" 
                            placeholder="John" 
                            defaultValue={user?.user_metadata?.first_name || ''}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input 
                            id="lastName" 
                            placeholder="Doe" 
                            defaultValue={user?.user_metadata?.last_name || ''}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={user?.email || ''} 
                          disabled 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currency">Default Currency</Label>
                        <Select defaultValue="USD">
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD - US Dollar</SelectItem>
                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                            <SelectItem value="GBP">GBP - British Pound</SelectItem>
                            <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleSaveProfile} className="w-full">
                        Save Profile Changes
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="notifications" className="space-y-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Push Notifications</Label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Receive notifications about your financial activities
                          </p>
                        </div>
                        <Switch 
                          checked={notificationsEnabled} 
                          onCheckedChange={setNotificationsEnabled}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Email Updates</Label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Get weekly financial summaries via email
                          </p>
                        </div>
                        <Switch 
                          checked={emailUpdates} 
                          onCheckedChange={setEmailUpdates}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Budget Alerts</Label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Alert when approaching budget limits
                          </p>
                        </div>
                        <Switch 
                          checked={budgetAlerts} 
                          onCheckedChange={setBudgetAlerts}
                        />
                      </div>
                      <Button onClick={handleSaveNotifications} className="w-full">
                        Save Notification Preferences
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="appearance" className="space-y-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Dark Mode</Label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Toggle between light and dark themes
                          </p>
                        </div>
                        <Switch 
                          checked={isDarkMode} 
                          onCheckedChange={toggleDarkMode}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Language</Label>
                        <Select defaultValue="en">
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="privacy" className="space-y-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                          Privacy Information
                        </h3>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          Your financial data is encrypted and stored securely. We never share your personal information with third parties.
                        </p>
                      </div>
                      <Button variant="outline" className="w-full">
                        <Shield className="mr-2 h-4 w-4" />
                        Review Privacy Policy
                      </Button>
                      <Button variant="outline" className="w-full">
                        <HelpCircle className="mr-2 h-4 w-4" />
                        Data Usage Information
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="data" className="space-y-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                          Data Management
                        </h3>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Export your data or request account deletion. These actions cannot be undone.
                        </p>
                      </div>
                      <Button onClick={handleExportData} variant="outline" className="w-full">
                        <Database className="mr-2 h-4 w-4" />
                        Export All Data
                      </Button>
                      <Button variant="destructive" className="w-full">
                        Delete Account
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
