"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Instagram, Youtube, Facebook, Video } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Project name must be at least 2 characters.",
    }),
    goal: z.enum(["awareness", "engagement", "conversion"]),
    platforms: z.array(z.string()).refine((value) => value.length > 0, {
        message: "You have to select at least one platform.",
    }),
    brandType: z.enum(["existing", "quick"]),
    // Quick brand fields
    brandName: z.string().optional(),
    voiceCasualProfessional: z.number().min(0).max(100).default(50),
    voiceBoldSoft: z.number().min(0).max(100).default(50),
    voicePlayfulSerious: z.number().min(0).max(100).default(50),
    visualRawPolished: z.number().min(0).max(100).default(50),
    visualMinimalBusy: z.number().min(0).max(100).default(50),
})

interface CreateProjectModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CreateProjectModal({ open, onOpenChange }: CreateProjectModalProps) {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            goal: "awareness",
            platforms: [],
            brandType: "existing",
            voiceCasualProfessional: 50,
            voiceBoldSoft: 50,
            voicePlayfulSerious: 50,
            visualRawPolished: 50,
            visualMinimalBusy: 50,
        },
    })

    const brandType = form.watch("brandType")
    const platforms = form.watch("platforms")

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        onOpenChange(false)
        // Handle submission -> Navigate to Storyboard or generate
    }

    const platformOptions = [
        { id: "instagram_reels", label: "Instagram Reels", icon: Instagram },
        { id: "instagram_feed", label: "Instagram Feed", icon: Instagram },
        { id: "youtube_shorts", label: "YouTube Shorts", icon: Youtube },
        { id: "meta_ads", label: "Meta Ads", icon: Facebook },
    ]

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[640px] p-0 overflow-hidden gap-0">
                <DialogHeader className="p-6 pb-4 border-b">
                    <DialogTitle>Create a new campaign</DialogTitle>
                    <DialogDescription>
                        We'll generate a starting storyboard for you.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[80vh]">
                    <div className="p-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                                {/* Section 1: Basics */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Basics</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem className="col-span-2 md:col-span-1">
                                                    <FormLabel>Campaign Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Summer Sale 2024" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="goal"
                                            render={({ field }) => (
                                                <FormItem className="col-span-2 md:col-span-1">
                                                    <FormLabel>Goal</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a goal" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="awareness">Awareness</SelectItem>
                                                            <SelectItem value="engagement">Engagement</SelectItem>
                                                            <SelectItem value="conversion">Conversion</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="border-t pt-6 space-y-4">
                                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Platforms</h3>
                                    <FormField
                                        control={form.control}
                                        name="platforms"
                                        render={() => (
                                            <FormItem>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    {platformOptions.map((item) => (
                                                        <FormField
                                                            key={item.id}
                                                            control={form.control}
                                                            name="platforms"
                                                            render={({ field }) => {
                                                                return (
                                                                    <FormItem
                                                                        key={item.id}
                                                                        className="flex flex-row items-start space-x-3 space-y-0"
                                                                    >
                                                                        <FormControl>
                                                                            <div className="relative flex items-start">
                                                                                <Checkbox
                                                                                    checked={field.value?.includes(item.id)}
                                                                                    onCheckedChange={(checked) => {
                                                                                        return checked
                                                                                            ? field.onChange([...field.value, item.id])
                                                                                            : field.onChange(
                                                                                                field.value?.filter(
                                                                                                    (value) => value !== item.id
                                                                                                )
                                                                                            )
                                                                                    }}
                                                                                    className="peer sr-only"
                                                                                    id={`platform-${item.id}`}
                                                                                />
                                                                                <label
                                                                                    htmlFor={`platform-${item.id}`}
                                                                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer w-full text-center gap-2 transition-all"
                                                                                >
                                                                                    <item.icon className="h-6 w-6" />
                                                                                    <span className="text-xs font-medium">{item.label}</span>
                                                                                </label>
                                                                            </div>
                                                                        </FormControl>
                                                                    </FormItem>
                                                                )
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {platforms.length > 0 && (
                                        <div className="text-sm text-green-600 font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                                            <Video className="h-4 w-4" />
                                            Target Duration: 7–15s
                                        </div>
                                    )}
                                </div>

                                <div className="border-t pt-6 space-y-4">
                                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Brand</h3>
                                    <FormField
                                        control={form.control}
                                        name="brandType"
                                        render={({ field }) => (
                                            <FormItem className="space-y-3">
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="flex flex-col space-y-1"
                                                    >
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="existing" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                Select existing brand
                                                            </FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="quick" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                Quick brand
                                                            </FormLabel>
                                                        </FormItem>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {brandType === "quick" && (
                                        <div className="pl-7 grid gap-6 pt-2 animate-in fade-in slide-in-from-top-2">
                                            <FormField
                                                control={form.control}
                                                name="brandName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Brand Name</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Acme Corp" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <div className="space-y-4">
                                                <FormLabel>Voice Tone</FormLabel>
                                                <div className="grid gap-4 px-2">
                                                    <div className="grid grid-cols-[1fr_2fr_1fr] items-center gap-2 text-xs text-muted-foreground">
                                                        <span className="text-right">Casual</span>
                                                        <FormField control={form.control} name="voiceCasualProfessional" render={({ field }) => (
                                                            <Slider defaultValue={[field.value ?? 50]} max={100} step={1} onValueChange={(val) => field.onChange(val[0])} />
                                                        )} />
                                                        <span>Professional</span>
                                                    </div>
                                                    <div className="grid grid-cols-[1fr_2fr_1fr] items-center gap-2 text-xs text-muted-foreground">
                                                        <span className="text-right">Bold</span>
                                                        <FormField control={form.control} name="voiceBoldSoft" render={({ field }) => (
                                                            <Slider defaultValue={[field.value ?? 50]} max={100} step={1} onValueChange={(val) => field.onChange(val[0])} />
                                                        )} />
                                                        <span>Soft</span>
                                                    </div>
                                                    <div className="grid grid-cols-[1fr_2fr_1fr] items-center gap-2 text-xs text-muted-foreground">
                                                        <span className="text-right">Playful</span>
                                                        <FormField control={form.control} name="voicePlayfulSerious" render={({ field }) => (
                                                            <Slider defaultValue={[field.value ?? 50]} max={100} step={1} onValueChange={(val) => field.onChange(val[0])} />
                                                        )} />
                                                        <span>Serious</span>
                                                    </div>
                                                </div>

                                            </div>

                                        </div>
                                    )}
                                </div>

                                {/* Footer is handled outside form but inside dialog usually, but here we can keep it inside for submit */}
                                <div className="pt-4 flex justify-end gap-2">
                                    <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
                                    <Button type="submit">Create storyboard</Button>
                                </div>

                            </form>
                        </Form>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
