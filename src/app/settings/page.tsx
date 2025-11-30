"use client";

import { useState, useRef, useEffect } from "react";
import Header from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProfile } from "@/hooks/use-profile";
import { Download, Upload, User } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function SettingsPage() {
    const t = useTranslations('Settings');
    const { profile, updateProfile, loading } = useProfile();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(profile);
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            setFormData(profile);
            if (!profile.name) {
                setIsEditing(true);
            }
        }
    }, [profile, loading]);

    const handleSave = () => {
        if (!formData.name || !formData.age || !formData.gender || !formData.language) {
            toast.error("Please fill all fields");
            return;
        }
        updateProfile(formData);

        // Set cookie for next-intl
        document.cookie = `NEXT_LOCALE=${formData.language}; path=/; max-age=31536000`;

        setIsEditing(false);
        toast.success("Profile saved");

        // If this was a new profile setup, we can offer to go to dashboard
        if (!profile.name) {
            router.push("/");
        } else {
            // Refresh to apply language change
            router.refresh();
        }
    };

    const handleDownload = () => {
        const data = {
            transactions: localStorage.getItem("transactions"),
            theme: localStorage.getItem("theme"),
            profile: localStorage.getItem("profile"),
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "expense-tracker-data.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("Data downloaded successfully");
    };

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const content = event.target?.result as string;
                const data = JSON.parse(content);

                if (data.transactions) localStorage.setItem("transactions", data.transactions);
                if (data.theme) localStorage.setItem("theme", data.theme);
                if (data.profile) localStorage.setItem("profile", data.profile);

                toast.success("Data uploaded successfully. Reloading...");
                setTimeout(() => {
                    window.location.href = "/";
                }, 1500);
            } catch (error) {
                console.error(error);
                toast.error("Failed to parse file");
            }
        };
        reader.readAsText(file);
    };

    const getInitials = (name: string) => {
        if (!name) return "";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    if (loading) return null;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black">
            <Header />
            <main className="mx-auto max-w-4xl px-4 py-8 space-y-8">
                <h1 className="text-3xl font-bold">{t('title')}</h1>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('profile')}</CardTitle>
                        <CardDescription>{t('manage')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-6">
                            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold overflow-hidden">
                                {formData.name ? getInitials(formData.name) : <User className="h-10 w-10" />}
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-medium">{t('avatar')}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {t('initials')}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4 grid-cols-2">
                            <div className="space-y-2 col-span-2 md:col-span-1">
                                <Label htmlFor="name">{t('name')}</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter your name"
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="space-y-2 col-span-2 md:col-span-1">
                                <Label htmlFor="age">{t('age')}</Label>
                                <Input
                                    id="age"
                                    type="number"
                                    value={formData.age}
                                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                    placeholder="Enter your age"
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="space-y-2 col-span-1">
                                <Label htmlFor="gender">{t('gender')}</Label>
                                <Select
                                    value={formData.gender}
                                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                                    disabled={!isEditing}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 col-span-1">
                                <Label htmlFor="language">{t('language')}</Label>
                                <Select
                                    value={formData.language || 'en'}
                                    onValueChange={(value) => setFormData({ ...formData, language: value })}
                                    disabled={!isEditing}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">English</SelectItem>
                                        <SelectItem value="es">Spanish</SelectItem>
                                        <SelectItem value="fr">French</SelectItem>
                                        <SelectItem value="de">German</SelectItem>
                                        <SelectItem value="hi">Hindi</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            {isEditing ? (
                                <>
                                    {profile.name && (
                                        <Button variant="outline" onClick={() => {
                                            setFormData(profile);
                                            setIsEditing(false);
                                        }}>
                                            {t('cancel')}
                                        </Button>
                                    )}
                                    <Button onClick={handleSave}>{t('save')}</Button>
                                </>
                            ) : (
                                <Button variant="outline" onClick={() => setIsEditing(true)}>
                                    {t('edit')}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('data')}</CardTitle>
                        <CardDescription>{t('manage')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <Button onClick={handleDownload} className="flex-1 gap-2">
                                <Download className="h-4 w-4" />
                                {t('download')}
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-1 gap-2"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload className="h-4 w-4" />
                                {t('upload')}
                            </Button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".json,.txt"
                                onChange={handleUpload}
                            />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {t('exportDesc')}
                        </p>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
