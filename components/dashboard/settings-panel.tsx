"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"

export function SettingsPanel() {
  const [notifications, setNotifications] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [dataRefresh, setDataRefresh] = useState("realtime")

  return (
    <div className="space-y-6 max-w-2xl">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Manage your application preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive notifications about important events</p>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>

          <Separator />

          {/* Email Alerts */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Email Alerts</Label>
              <p className="text-sm text-muted-foreground">Get email notifications for critical alerts</p>
            </div>
            <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
          </div>

          <Separator />

          {/* Dark Mode */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">Use dark theme for the interface</p>
            </div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
        </CardContent>
      </Card>

      {/* Data Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Data Preferences</CardTitle>
          <CardDescription>Configure how your data is displayed and updated</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="refresh-rate">Data Refresh Rate</Label>
            <Select value={dataRefresh} onValueChange={setDataRefresh}>
              <SelectTrigger id="refresh-rate">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Real-time (Every 5 seconds)</SelectItem>
                <SelectItem value="frequent">Frequent (Every 30 seconds)</SelectItem>
                <SelectItem value="normal">Normal (Every minute)</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Constituency Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Constituency Settings</CardTitle>
          <CardDescription>Configure your active constituency</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="constituency">Active Constituency</Label>
            <Select defaultValue="new-delhi-01">
              <SelectTrigger id="constituency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new-delhi-01">New Delhi - 01 (Chandni Chowk)</SelectItem>
                <SelectItem value="new-delhi-02">New Delhi - 02 (New Delhi)</SelectItem>
                <SelectItem value="new-delhi-03">New Delhi - 03 (Karol Bagh)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="language">Display Language</Label>
            <Select defaultValue="english">
              <SelectTrigger id="language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="hindi">Hindi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Manage your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="your@email.com" defaultValue="analyst@janinsight.gov" />
          </div>

          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="Your name" defaultValue="Analyst" />
          </div>

          <Button variant="outline" className="w-full">Update Profile</Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10">
            Reset Dashboard Data
          </Button>
          <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10">
            Clear Cache
          </Button>
          <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10">
            Export Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
