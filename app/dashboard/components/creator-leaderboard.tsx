"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const creators = [
  {
    id: "1",
    handle: "@Creator1",
    name: "Alex Johnson",
    avatar: "/diverse-avatars.png",
    initials: "AJ",
    totalViews: 245000,
    campaign: "Summer Collection",
  },
  {
    id: "2",
    handle: "@Creator2",
    name: "Sam Wilson",
    avatar: "/diverse-avatars.png",
    initials: "SW",
    totalViews: 198000,
    campaign: "Product Launch",
  },
  {
    id: "3",
    handle: "@Creator3",
    name: "Jamie Smith",
    avatar: "/diverse-avatars.png",
    initials: "JS",
    totalViews: 176000,
    campaign: "Summer Collection",
  },
  {
    id: "4",
    handle: "@Creator4",
    name: "Taylor Reed",
    avatar: "/diverse-avatars.png",
    initials: "TR",
    totalViews: 145000,
    campaign: "Product Launch",
  },
  {
    id: "5",
    handle: "@Creator5",
    name: "Jordan Lee",
    avatar: "/diverse-avatars.png",
    initials: "JL",
    totalViews: 132000,
    campaign: "Summer Collection",
  },
]

export function CreatorLeaderboard() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Creator Leaderboard</CardTitle>
        <CardDescription>Top performing creators this month</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Creator</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Campaign</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {creators.map((creator, index) => (
              <TableRow key={creator.id}>
                <TableCell className="font-medium">
                  <Badge variant={index === 0 ? "default" : "outline"}>#{index + 1}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={creator.avatar || "/placeholder.svg"} alt={creator.name} />
                      <AvatarFallback>{creator.initials}</AvatarFallback>
                    </Avatar>
                    <span>{creator.handle}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">{creator.totalViews.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline" className="ml-auto">
                    {creator.campaign}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
