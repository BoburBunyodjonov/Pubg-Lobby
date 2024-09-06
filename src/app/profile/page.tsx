'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { getParticipants, logoutUser, Participant } from '../../data/firebaseUtils'

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([])

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const fetchedParticipants = await getParticipants()
        setParticipants(fetchedParticipants)
      } catch (error) {
        console.error("Error fetching participants: ", error)
      }
    }

    fetchParticipants()
  }, [])

  const handleLogout = async () => {
    try {
      await logoutUser()
      window.location.href = '/login'
    } catch (error) {
      console.error("Error logging out: ", error)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="shadow-lg">
        <CardHeader className="flex justify-between items-center bg-gray-800 text-white p-4 rounded-t-lg">
          <CardTitle className="text-xl font-semibold">PUBG Mobile Tournament Participants</CardTitle>
          <Button 
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </Button>
        </CardHeader>
        <CardContent>
          <Table className="w-full border border-gray-300 rounded-lg overflow-hidden">
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="p-3 text-left text-gray-600">Player</TableHead>
                <TableHead className="p-3 text-left text-gray-600">Name</TableHead>
                <TableHead className="p-3 text-left text-gray-600">PUBG ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.map((participant, index) => (
                <TableRow 
                  key={index}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <TableCell className="p-3">
                    <Avatar>
                      <AvatarImage 
                        src={`https://api.dicebear.com/6.x/initials/svg?seed=${participant.name}`} 
                        alt={`${participant.name}'s avatar`} 
                        className="w-12 h-12 rounded-full"
                      />
                      <AvatarFallback className="text-lg font-semibold">{participant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="p-3">{participant.name}</TableCell>
                  <TableCell className="p-3">{participant.phone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
