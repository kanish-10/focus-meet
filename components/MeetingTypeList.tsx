'use client'

import HomeCard from '@/components/cards/HomeCard'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import MeetingModal from '@/modals/MeetingModal'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { toast } from '@/components/ui/use-toast'
import { Textarea } from '@/components/ui/textarea'
import ReactDatePicker from 'react-datepicker'
import { Input } from '@/components/ui/input'

const MeetingTypeList = () => {
  const router = useRouter()
  const [meetingState, setMeetingState] = useState<
    'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined
  >(undefined)

  const { user } = useUser()
  const client = useStreamVideoClient()
  const [value, setValue] = useState({
    dateTime: new Date(),
    description: '',
    link: ''
  })
  const [callDetails, setCallDetails] = useState<Call>()

  const createMeeting = async () => {
    if (!client || !user) return
    try {
      if (!value.dateTime) {
        toast({ title: 'Please select a date and time' })
        return
      }
      const id = crypto.randomUUID()
      const call = client.call('default', id)
      if (!call) throw new Error('Failed to create call')
      const startsAt =
        value.dateTime.toISOString() || new Date(Date.now()).toISOString()
      const description = value.description || 'Instant Meeting'

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description
          }
        }
      })
      setCallDetails(call)
      if (!value.description) {
        router.push(`/meeting/${call.id}`)
      }
      toast({ title: 'Meeting Created' })
    } catch (e) {
      console.log(e)
      toast({ title: 'Failed to create meeting' })
    }
  }

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <HomeCard
        title="New Meeting"
        subText="Start an instatnt meeting"
        background="bg-orange-1"
        icon="/icons/add-meeting.svg"
        handleClick={() => setMeetingState('isInstantMeeting')}
      />
      <HomeCard
        title="Schedule Meeting"
        subText="Plan your meeting"
        background="bg-blue-1"
        icon="/icons/schedule.svg"
        handleClick={() => setMeetingState('isScheduleMeeting')}
      />
      <HomeCard
        title="View Recordings"
        subText="Check out your recordings"
        background="bg-purple-1"
        icon="/icons/recordings.svg"
        handleClick={() => router.push('/recordings')}
      />
      <HomeCard
        title="Join Meeting"
        subText="via invitation link"
        background="bg-yellow-1"
        icon="/icons/join-meeting.svg"
        handleClick={() => setMeetingState('isJoiningMeeting')}
      />
      {/* eslint-disable-next-line multiline-ternary */}
      {!callDetails ? (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Create Meeting"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5">
            <label className="text-base font-normal leading-[22px] text-sky-2">
              Add a description
            </label>
            <Textarea
              className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={(e) => {
                setValue({ ...value, description: e.target.value })
              }}
            />
          </div>
          <div className="flex w-full flex-col gap-2.5">
            <label className="text-base leading-[22px] text-sky-2">
              Select Date and Time
            </label>
            <ReactDatePicker
              selected={value.dateTime}
              onChange={(date) => setValue({ ...value, dateTime: date! })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full rounded bg-dark-3 p-2 focus:outline-none"
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Meeting created"
          className="text-center"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink)
            toast({ title: 'Link copied' })
          }}
          image="/icons/checked.svg"
          buttonIcon="/icons/copy.svg"
          buttonText="Copy Meeting Link"
        />
      )}
      <MeetingModal
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Start an Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />
      <MeetingModal
        isOpen={meetingState === 'isJoiningMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Type the link here"
        className="text-center"
        buttonText="Join Meeting"
        handleClick={() => router.push(value.link)}
      >
        <Input
          placeholder="Meeting link"
          className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={(e) => setValue({ ...value, link: e.target.value })}
        />
      </MeetingModal>
    </section>
  )
}

export default MeetingTypeList
