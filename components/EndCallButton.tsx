'use client'

import React from 'react'
import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const EndCallButton = () => {
  const router = useRouter()
  const call = useCall()
  const { useLocalParticipant } = useCallStateHooks()
  const localParticipants = useLocalParticipant()
  const isMeetingOwner =
    localParticipants &&
    call?.state.createdBy &&
    localParticipants.userId === call?.state.createdBy.id

  if (!isMeetingOwner) return null

  return (
    <Button
      className="bg-red-500"
      onClick={async () => {
        await call?.endCall()
        router.push('/')
      }}
    >
      End call for everyone
    </Button>
  )
}

export default EndCallButton
