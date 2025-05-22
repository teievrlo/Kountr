import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const campaigns = [
  {
    id: "1",
    name: "Summer Collection",
    creators: 12,
    views: "245K",
    status: "active",
    progress: 68,
    daysLeft: 14,
  },
  {
    id: "2",
    name: "Product Launch",
    creators: 8,
    views: "120K",
    status: "active",
    progress: 42,
    daysLeft: 21,
  },
  {
    id: "3",
    name: "Holiday Special",
    creators: 5,
    views: "85K",
    status: "draft",
    progress: 0,
    daysLeft: 45,
  },
]

export function CampaignStatus() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Active Campaigns</CardTitle>
          <CardDescription>Track your campaign performance</CardDescription>
        </div>
        <Button size="sm">New Campaign</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{campaign.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{campaign.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {campaign.creators} creators • {campaign.views} views
                    </div>
                  </div>
                </div>
                <Badge variant={campaign.status === "active" ? "default" : "outline"}>
                  {campaign.status === "active" ? "Active" : "Draft"}
                </Badge>
              </div>
              <Progress value={campaign.progress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{campaign.progress}% complete</span>
                <span>{campaign.daysLeft} days left</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
