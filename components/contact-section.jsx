"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Mail, MapPin, Phone, DollarSign, Send, Coffee, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function ContactSection() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [messageSent, setMessageSent] = useState(false)
  const formRef = useRef(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.target)
      const messageData = {
        name: formData.get("name"),
        email: formData.get("email"),
        subject: formData.get("subject"),
        message: formData.get("message"),
        createdAt: serverTimestamp(),
      }

      // Add the message to Firestore
      await addDoc(collection(db, "messages"), messageData)

      toast({
        title: "Message sent!",
        description: "Thank you for your message. I'll get back to you soon.",
      })

      formRef.current.reset()
      setMessageSent(true)
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-20">
    <div className="container mx-auto px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center mb-12">
          <div className="h-px w-12 bg-primary mr-4"></div>
          <h2 className="text-3xl font-bold">
            Get In <span className="pink-gradient-text">Touch</span>
          </h2>
          <div className="h-px w-12 bg-primary ml-4"></div>
        </div>
  
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
  
            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="bg-blue-100 dark:bg-blue-900/20 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#ec489915] transition-colors">
                  <Mail className="text-primary h-5 w-5 group-hover:text-[#ec4899] transition-colors" />
                </div>
                <div>
                  <h4 className="text-base font-medium mb-1">Email</h4>
                  <a
                    href="mailto:hello@hassana.dev"
                    className="text-foreground/70 hover:text-[#ec4899] transition-colors"
                  >
                    hello@hassana.dev
                  </a>
                </div>
              </div>
  
              <div className="flex items-start gap-4 group">
                <div className="bg-blue-100 dark:bg-blue-900/20 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#ec489915] transition-colors">
                  <Phone className="text-primary h-5 w-5 group-hover:text-[#ec4899] transition-colors" />
                </div>
                <div>
                  <h4 className="text-base font-medium mb-1">Phone</h4>
                  <a href="tel:+123456789" className="text-foreground/70 hover:text-[#ec4899] transition-colors">
                    +1 (234) 567-89
                  </a>
                </div>
              </div>
  
              <div className="flex items-start gap-4 group">
                <div className="bg-blue-100 dark:bg-blue-900/20 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#ec489915] transition-colors">
                  <MapPin className="text-primary h-5 w-5 group-hover:text-[#ec4899] transition-colors" />
                </div>
                <div>
                  <h4 className="text-base font-medium mb-1">Location</h4>
                  <p className="text-foreground/70">Your City, Country</p>
                </div>
              </div>
            </div>
  
            <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-[#ec489910] dark:from-blue-900/10 dark:to-[#ec489915] rounded-lg border border-blue-100 dark:border-blue-800/20">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="h-5 w-5 text-[#ec4899]" />
                <h4 className="text-lg font-medium">Let's connect!</h4>
              </div>
              <p className="text-foreground/70 mb-4">
                Whether you have a question, project idea, or just want to say hello, I'd love to hear from you.
              </p>
              <p className="text-foreground/70">
                <span className="italic">Pro tip:</span> Mentioning money in your message increases response speed by 100%! 
              </p>
            </div>
          </motion.div>
  
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-semibold mb-6">Send Me a Message</h3>
  
            {messageSent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#ec489910] border border-[#ec489930] rounded-lg p-8 text-center"
              >
                <Sparkles className="h-12 w-12 text-[#ec4899] mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">Message Received!</h4>
                <p className="mb-4">
                  Thanks for reaching out. I'll get back to you faster than a bank alert!
                </p>
                <Button onClick={() => setMessageSent(false)} className="bg-[#ec4899] hover:bg-[#ec4899]/90">
                  Send Another Message
                </Button>
              </motion.div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      required
                      className="border-input focus:border-[#ec489950] focus:ring-[#ec489930]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Your email"
                      required
                      className="border-input focus:border-[#ec489950] focus:ring-[#ec489930]"
                    />
                  </div>
                </div>
  
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="What is this regarding?"
                    required
                    className="border-input focus:border-[#ec489950] focus:ring-[#ec489930]"
                  />
                </div>
  
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Your message... (bonus points for including a money joke!)"
                    rows={5}
                    required
                    className="border-input focus:border-[#ec489950] focus:ring-[#ec489930]"
                  />
                </div>
  
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-[#ec4899] hover:opacity-90 bounce-on-hover"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Send Message
                    </span>
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  </section>
  )
}
