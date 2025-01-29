"use client"

import { useState } from "react"
import MessageButton from "./MessageButton"
import MessagePanel from "./MessagePanel"

export function Messaging() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <MessageButton onClick={() => setIsOpen(!isOpen)} />
      {isOpen && <MessagePanel onClose={() => setIsOpen(false)} />}
    </div>
  )
}

