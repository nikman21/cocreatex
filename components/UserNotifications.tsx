"use client";

import React, { useState } from "react";
import { acceptApplication, rejectApplication } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const UserNotifications = ({ userId, applications, notifications }: { 
  userId: string; 
  applications: any[]; 
  notifications: any[];
}) => {
  const router = useRouter();
  const [selectedApplication, setSelectedApplication] = useState<any | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const handleAccept = async (applicationId: string) => {
    setLoading(applicationId);
    await acceptApplication(applicationId);
    setLoading(null);
    router.refresh(); // Refresh UI after action
  };

  const handleReject = async (applicationId: string) => {
    setLoading(applicationId);
    await rejectApplication(applicationId);
    setLoading(null);
    router.refresh();
  };

  return (
    <div className="notifications space-y-6">
      {/* Combined Notifications & Application Requests */}

      {applications.length === 0 && notifications.length === 0 ? (
        <p className="text-black-100 text-sm font-normal">No new activity.</p>
      ) : (
        <div className="space-y-6">
          {/* Pending Applications */}
          {applications.map((app) => (
            <Dialog key={app._id}>
              <DialogTrigger asChild>
                <div 
                  className="notification-card bg-primary border-[5px] border-black shadow-200 rounded-[15px] p-5 cursor-pointer hover:shadow-300 transition-all"
                  onClick={() => setSelectedApplication(app)}
                >
                  <p className="text-black text-lg font-bold">
                    {app.applicant.name} <span className="text-black-100">applied to</span> {app.project.title}
                  </p>
                </div>
              </DialogTrigger>
              
              {/* Application Details Modal */}
              {selectedApplication && selectedApplication._id === app._id && (
                <DialogContent className="space-y-4 bg-white border-[5px] border-black shadow-300 rounded-[15px] p-6">
                  <DialogHeader>
                    <DialogTitle className="text-24-black border-b-[5px] border-black pb-2">
                      Application Details
                    </DialogTitle>
                  </DialogHeader>

                  <div className="flex items-center space-x-4">
                    <Image 
                      src={app.applicant.image} 
                      alt={app.applicant.name} 
                      width={60} 
                      height={60} 
                      className="rounded-full border-[3px] border-black"
                    />
                    <div>
                      <p className="text-20-medium">{app.applicant.name}</p>
                      <p className="text-black-100">@{app.applicant.username}</p>
                    </div>
                  </div>

                  <div className="space-y-3 bg-black-100 p-5 rounded-[10px] border-[5px] border-black shadow-100">
                    <p className="text-white"><strong>Project:</strong> {app.project.title}</p>
                    <p className="text-white">
                      <strong>GitHub:</strong> 
                      <a href={app.github} className="text-accent hover:underline ml-2" target="_blank">{app.github}</a>
                    </p>
                    <p><strong>Discord:</strong> {app.discord}</p>
                    <p className="text-white">
                      <strong>Portfolio:</strong> 
                      <a href={app.portfolio} className="text-accent hover:underline ml-2" target="_blank">{app.portfolio}</a>
                    </p>
                    <p className="text-white"><strong>Message:</strong> {app.message}</p>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button 
                      onClick={() => handleAccept(app._id)} 
                      disabled={loading === app._id} 
                      className="bg-green-500 text-black border-[3px] border-black shadow-100 hover:shadow-none px-5 py-3 font-bold"
                    >
                      {loading === app._id ? "Accepting..." : "Accept"}
                    </Button>
                    <Button 
                      onClick={() => handleReject(app._id)} 
                      disabled={loading === app._id} 
                      className="bg-red-500 text-black border-[3px] border-black shadow-100 hover:shadow-none px-5 py-3 font-bold"
                    >
                      {loading === app._id ? "Rejecting..." : "Reject"}
                    </Button>
                  </div>
                </DialogContent>
              )}
            </Dialog>
          ))}

          {/* Application Status Updates */}
          {notifications.map((notif) => (
            <div key={notif._id} className="notification-card bg-white border-[5px] border-black shadow-200 rounded-[15px] p-5">
              <p className="text-black">
                Your application for <strong>{notif.project.title}</strong> has been 
                <span className={`ml-2 font-bold ${notif.status === "accepted" ? "text-green-600" : "text-red-600"}`}>
                  {notif.status}
                </span>.
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserNotifications;
