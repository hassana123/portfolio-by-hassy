"use client"

import { useState, useEffect } from "react"
import { Check, Edit, Plus, Trash, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function SkillsPage() {
  const [skills, setSkills] = useState([])
  const [editingSkill, setEditingSkill] = useState(null)
  const [newSkill, setNewSkill] = useState({ name: "", level: 50, category: "Frontend Development" })
  const [isAddingSkill, setIsAddingSkill] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Define skill categories
  const skillCategories = [
    "Frontend Development",
    "UI/UX & Design",
    "Tools & Workflow",
    "State Management",
    "Backend Knowledge",
    "Performance & SEO",
    "Other",
  ]

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      setLoading(true)
      const skillsCollection = collection(db, "skills")
      const skillsSnapshot = await getDocs(skillsCollection)
      const skillsList = skillsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setSkills(skillsList)
    } catch (error) {
      console.error("Error fetching skills:", error)
      toast({
        title: "Error",
        description: "Failed to load skills. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditSkill = (skill) => {
    setEditingSkill({
      ...skill,
      category: skill.category || "Other",
    })
  }

  const handleSaveSkill = async () => {
    if (!editingSkill.name.trim()) {
      toast({
        title: "Error",
        description: "Skill name cannot be empty",
        variant: "destructive",
      })
      return
    }

    try {
      await updateDoc(doc(db, "skills", editingSkill.id), {
        name: editingSkill.name,
        level: editingSkill.level,
        category: editingSkill.category,
        updatedAt: serverTimestamp(),
      })

      toast({
        title: "Skill updated",
        description: "The skill has been updated successfully.",
      })

      setEditingSkill(null)
      fetchSkills()
    } catch (error) {
      console.error("Error updating skill:", error)
      toast({
        title: "Error",
        description: "Failed to update skill. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCancelEdit = () => {
    setEditingSkill(null)
  }

  const handleDeleteSkill = async (id) => {
    try {
      await deleteDoc(doc(db, "skills", id))

      toast({
        title: "Skill deleted",
        description: "The skill has been deleted successfully.",
      })

      fetchSkills()
    } catch (error) {
      console.error("Error deleting skill:", error)
      toast({
        title: "Error",
        description: "Failed to delete skill. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddSkill = async () => {
    if (!newSkill.name.trim()) {
      toast({
        title: "Error",
        description: "Skill name cannot be empty",
        variant: "destructive",
      })
      return
    }

    try {
      await addDoc(collection(db, "skills"), {
        name: newSkill.name,
        level: newSkill.level,
        category: newSkill.category,
        createdAt: serverTimestamp(),
      })

      toast({
        title: "Skill added",
        description: "The new skill has been added successfully.",
      })

      setNewSkill({ name: "", level: 50, category: "Frontend Development" })
      setIsAddingSkill(false)
      fetchSkills()
    } catch (error) {
      console.error("Error adding skill:", error)
      toast({
        title: "Error",
        description: "Failed to add skill. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Group skills by category
  const getSkillsByCategory = () => {
    const categorizedSkills = {}

    skillCategories.forEach((category) => {
      const categorySkills = skills.filter((skill) => skill.category === category)
      if (categorySkills.length > 0) {
        categorizedSkills[category] = categorySkills
      }
    })

    // Add skills without category to "Other"
    const uncategorizedSkills = skills.filter((skill) => !skill.category)
    if (uncategorizedSkills.length > 0) {
      if (categorizedSkills["Other"]) {
        categorizedSkills["Other"] = [...categorizedSkills["Other"], ...uncategorizedSkills]
      } else {
        categorizedSkills["Other"] = uncategorizedSkills
      }
    }

    return categorizedSkills
  }

  const categorizedSkills = getSkillsByCategory()

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
          <p className="mt-2 text-foreground/70">Loading skills...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Skills</h1>
          <p className="text-foreground/70">Manage your skills and proficiency levels</p>
        </div>
        <Button className="mt-4 sm:mt-0 bg-pink-500 hover:bg-pink-600" onClick={() => setIsAddingSkill(!isAddingSkill)}>
          {isAddingSkill ? (
            <>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add New Skill
            </>
          )}
        </Button>
      </div>

      {isAddingSkill && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">Add New Skill</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Skill Name</label>
                <Input
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  placeholder="Enter skill name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
  value={newSkill.category}
  onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
  className="border rounded px-3 py-2 w-full" // Tailwind styling (optional)
>
  <option value="" disabled>Select a category</option>
  {skillCategories.map((category) => (
    <option key={category} value={category}>
      {category}
    </option>
  ))}
</select>

              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Proficiency Level: {newSkill.level}%</label>
                <Slider
                  value={[newSkill.level]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={(value) => setNewSkill({ ...newSkill, level: value[0] })}
                  className="my-4"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddingSkill(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddSkill} className="bg-pink-500 hover:bg-pink-600">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Skill
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {Object.entries(categorizedSkills).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(categorizedSkills).map(([category, categorySkills]) => (
            <div key={category}>
              <h2 className="text-xl font-semibold mb-4">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categorySkills.map((skill) => (
                  <Card key={skill.id}>
                    <CardContent className="p-4">
                      {editingSkill && editingSkill.id === skill.id ? (
                        <div className="space-y-4">
                          <Input
                            value={editingSkill.name}
                            onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                          />
                          <div>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <Select
                              value={editingSkill.category || "Other"}
                              onValueChange={(value) => setEditingSkill({ ...editingSkill, category: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                              <SelectContent>
                                {skillCategories.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Level: {editingSkill.level}%</span>
                            <Slider
                              value={[editingSkill.level]}
                              min={0}
                              max={100}
                              step={5}
                              onValueChange={(value) => setEditingSkill({ ...editingSkill, level: value[0] })}
                              className="my-2"
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                              <X className="mr-1 h-4 w-4" />
                              Cancel
                            </Button>
                            <Button size="sm" onClick={handleSaveSkill} className="bg-green-500 hover:bg-green-600">
                              <Check className="mr-1 h-4 w-4" />
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">{skill.name}</h3>
                            <div className="flex space-x-1">
                              <Button size="icon" variant="ghost" onClick={() => handleEditSkill(skill)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDeleteSkill(skill.id)}
                                className="text-destructive"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-foreground/70">Proficiency</span>
                              <span className="font-medium">{skill.level}%</span>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-pink-400 to-pink-600 rounded-full"
                                style={{ width: `${skill.level}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-lg font-medium">No skills added yet</div>
          <p className="text-foreground/70">Click the "Add New Skill" button to add your first skill.</p>
        </div>
      )}
    </div>
  )
}
