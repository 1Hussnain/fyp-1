
import React from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Dashboard/Sidebar";
import TopNav from "../components/Dashboard/TopNav";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";

const Settings = () => {
  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopNav />
        <main className="p-6 space-y-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings</h1>
            
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="grid grid-cols-3 mb-6 w-full max-w-md">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="privacy">Privacy</TabsTrigger>
              </TabsList>
              
              <TabsContent value="account">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue="John Doe" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" defaultValue="john.doe@example.com" />
                    </div>
                    
                    <div className="pt-4">
                      <Button onClick={handleSave}>Save Changes</Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <Switch id="email-notifications" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="budget-alerts">Budget Alerts</Label>
                      <Switch id="budget-alerts" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="goal-updates">Goal Updates</Label>
                      <Switch id="goal-updates" defaultChecked />
                    </div>
                    
                    <div className="pt-4">
                      <Button onClick={handleSave}>Save Preferences</Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="privacy">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Privacy Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="data-sharing">Data Sharing</Label>
                      <Switch id="data-sharing" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="analytics">Usage Analytics</Label>
                      <Switch id="analytics" defaultChecked />
                    </div>
                    
                    <div className="pt-4">
                      <Button onClick={handleSave}>Save Settings</Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
