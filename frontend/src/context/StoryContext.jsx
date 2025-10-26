import React, { createContext, useContext, useState, useCallback } from 'react'
import { storyApi } from '../api/storyApi'
import { toast } from 'react-toastify'

const StoryContext = createContext()

export const StoryProvider = ({ children }) => {
  const [stories, setStories] = useState([])
  const [currentStory, setCurrentStory] = useState(null)
  const [loading, setLoading] = useState(false)
  const [bookmarks, setBookmarks] = useState([])

  const loadStories = useCallback(async () => {
    setLoading(true)
    try {
      const storiesData = await storyApi.getAllStories()
      setStories(storiesData)
    } catch (error) {
      toast.error('Failed to load stories')
    } finally {
      setLoading(false)
    }
  }, [])

  const loadStory = useCallback(async (storyId) => {
    setLoading(true)
    try {
      const story = await storyApi.getStoryById(storyId)
      setCurrentStory(story)
      return story
    } catch (error) {
      toast.error('Failed to load story')
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const createStory = async (storyData) => {
    try {
      const response = await storyApi.createStory(storyData)
      setStories(prev => [response.story, ...prev])
      toast.success('Story created successfully!')
      return response
    } catch (error) {
      toast.error('Failed to create story')
      throw error
    }
  }

  const updateStory = async (storyId, storyData) => {
    try {
      const response = await storyApi.updateStory(storyId, storyData)
      setStories(prev => prev.map(story => 
        story._id === storyId ? response.story : story
      ))
      if (currentStory && currentStory._id === storyId) {
        setCurrentStory(response.story)
      }
      toast.success('Story updated successfully!')
      return response
    } catch (error) {
      toast.error('Failed to update story')
      throw error
    }
  }

  const deleteStory = async (storyId) => {
    try {
      await storyApi.deleteStory(storyId)
      setStories(prev => prev.filter(story => story._id !== storyId))
      if (currentStory && currentStory._id === storyId) {
        setCurrentStory(null)
      }
      toast.success('Story deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete story')
      throw error
    }
  }

  const toggleLike = async (storyId) => {
    try {
      const response = await storyApi.toggleLike(storyId)
      setStories(prev => prev.map(story => 
        story._id === storyId ? response.story : story
      ))
      if (currentStory && currentStory._id === storyId) {
        setCurrentStory(response.story)
      }
      return response
    } catch (error) {
      toast.error('Failed to toggle like')
      throw error
    }
  }

  const value = {
    stories,
    currentStory,
    loading,
    bookmarks,
    loadStories,
    loadStory,
    createStory,
    updateStory,
    deleteStory,
    toggleLike,
  }

  return (
    <StoryContext.Provider value={value}>
      {children}
    </StoryContext.Provider>
  )
}

export const useStory = () => {
  const context = useContext(StoryContext)
  if (!context) {
    throw new Error('useStory must be used within a StoryProvider')
  }
  return context
}