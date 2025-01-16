// ---------------------------------------------------------------------------------------------

import React, { useState, useEffect, useCallback } from 'react'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import Cookies from 'js-cookie'
import { useAuth } from '@/context/AuthContext'
import { PostType } from '@/context/PostContext'

type EditPostModalProps = {
  post: PostType
  onClose: any
}

const EditPostModal = ({ post, onClose }: EditPostModalProps) => {
  const { setAuth } = useAuth()

  // Fetch user data from the server
  const [postInfo, setPostInfo] = useState<PostType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [open, setOpen] = useState(true)
  const [success, setSuccess] = useState(false)

  // Local state for form inputs
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  const baseUrl = process.env.REACT_APP_BASEURL

  // FETCH POST DATA PASSED FROM PARENT COMPONENT
  const fetchPost = useCallback(async () => {
    try {
      const postData = post
      setPostInfo(postData)

      // Initialize the form values with the user data
      setTitle(postData?.title || '')
      setBody(postData?.body || '')
    } catch (error) {
      console.log('Error fetching post data:', error)
      setError(true)
    }
  }, [post])

  //FUNCTION TO HANDLE POST EDIT/UPDATE
  const handleUpdatePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const data = Object.fromEntries(formData)

    try {
      setLoading(true)
      const updatedPostData = {
        ...data,
      }

      const response = await fetch(`${baseUrl}/posts/${post.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('accessToken')}`,
        },
        body: JSON.stringify(updatedPostData),
      })

      if (!response.ok) {
        console.log('Error updating user data')
        return
      }

      const updatedData = await response.json()
      setAuth(true, updatedData.data)
      setSuccess(true)
      setOpen(false)
    } catch (error) {
      console.log('Error updating user data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPost()
  }, [fetchPost])

  //FEEL FREE TO CHANGE MODAL COMPONET STYLE TO YOUR TASTE BECAUSE IT DOES NOT OVERLAP THE POST MODAL DUE TO STYLING

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="p-3">
                <h1 className="">EDIT POST</h1>
              </div>

              <div className="sm:flex sm:items-start">
                <form
                  onSubmit={handleUpdatePost}
                  className="flex flex-col gap-3"
                >
                  <div>
                    <img
                      src={postInfo?.mediaResource[0].url}
                      alt="post"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                  <div></div>
                  {/* <input type="file" accept="image/*" onChange={handleImageChange} /> */}
                  <div className="flex flex-col">
                    <label htmlFor="title">Title</label>
                    <input
                      type="text"
                      name="tile"
                      placeholder="Title"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="body">Body</label>
                    <textarea
                      name="body"
                      placeholder="Description"
                      value={body}
                      onChange={e => setBody(e.target.value)}
                    />
                  </div>

                  <button
                    className="flex justify-center border bg-blue-400"
                    type="submit"
                  >
                    {loading ? 'Loading ...' : success ? 'Success' : 'Update'}
                  </button>
                </form>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

export default EditPostModal
