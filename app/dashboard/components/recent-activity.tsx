import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const activities = [
  {
    id: "1",
    user: {
      name: "@Creator1",
      avatar: "/diverse-avatars.png",
      initials: "C1",
    },
    action: "uploaded a new video",
    target: "Summer Collection",
    time: "2 hours ago",
  },
  {
    id: "2",
    user: {
      name: "@Creator3",
      avatar: "/diverse-avatars.png",
      initials: "C3",
    },
    action: "reached 5,000 views on",
    target: "Product Review",
    time: "5 hours ago",
  },
  {
    id: "3",
    user: {
      name: "@Creator2",
      avatar: "/diverse-avatars.png",
      initials: "C2",
    },
    action: "joined campaign",
    target: "Product Launch",
    time: "1 day ago",
  },
  {
    id: "4",
    user: {
      name: "@Creator5",
      avatar: "/diverse-avatars.png",
      initials: "C5",
    },
    action: "achieved engagement milestone on",
    target: "Tutorial Video",
    time: "2 days ago",
  },
]

export function RecentActivity() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates from your creators</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                <AvatarFallback>{activity.user.initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  <span className="font-semibold">{activity.user.name}</span> {activity.action}{" "}
                  <span className="font-semibold">"{activity.target}"</span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
