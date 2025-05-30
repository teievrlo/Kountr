"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreatorsList } from "./creators-list"
import { AddCreatorForm } from "./add-creator-form"
import { CreatorsTable } from "./creators-table"
import { Button } from "@/components/ui/button"
import { PlusCircle, Users, UserPlus, Table } from "lucide-react"
import { AddCreatorDialog } from "./add-creator-dialog"

export function CreatorsView() {
  const [activeTab, setActiveTab] = useState("overview")
  const [refreshKey, setRefreshKey] = useState(0)

  const handleCreatorAdded = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="table" className="flex items-center gap-2">
            <Table className="h-4 w-4" />
            Table View
          </TabsTrigger>
          <TabsTrigger value="add" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add Creator
          </TabsTrigger>
        </TabsList>

        <AddCreatorDialog onCreatorAdded={handleCreatorAdded}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Quick Add
          </Button>
        </AddCreatorDialog>
      </div>

      <TabsContent value="overview" className="space-y-4">
        <CreatorsList key={refreshKey} />
      </TabsContent>

      <TabsContent value="table" className="space-y-4">
        <CreatorsTable key={refreshKey} />
      </TabsContent>

      <TabsContent value="add" className="space-y-4">
        <AddCreatorForm onCreatorAdded={handleCreatorAdded} />
      </TabsContent>
    </Tabs>
  )
}
