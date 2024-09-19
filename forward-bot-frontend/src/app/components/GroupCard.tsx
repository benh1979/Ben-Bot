import React from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Shield, MessageCircle, User, Lock } from 'lucide-react';
import { GroupParticipant } from '@whiskeysockets/baileys';
import Image from 'next/image';



export interface GroupMetadata {
    id: string
    owner: string | undefined
    subject: string
    /** group subject owner */
    subjectOwner?: string
    /** group subject modification date */
    subjectTime?: number
    creation?: number
    desc?: string
    descOwner?: string
    descId?: string
    /** if this group is part of a community, it returns the jid of the community to which it belongs */
    linkedParent?: string
    /** is set when the group only allows admins to change group settings */
    restrict?: boolean
    /** is set when the group only allows admins to write messages */
    announce?: boolean
    /** is set when the group also allows members to add participants */
    memberAddMode?: boolean
    /** Request approval to join the group */
    joinApprovalMode?: boolean
    /** is this a community */
    isCommunity?: boolean
    /** is this the announce of a community */
    isCommunityAnnounce?: boolean
    /** number of group participants */
    size?: number
    // Baileys modified array
    participants: GroupParticipant[]
    ephemeralDuration?: number
    inviteCode?: string
    /** the person who added you to group or changed some setting in group */
    author?: string
    imageUrl: string | null;
}

export interface GroupCardProps {
    group?: GroupMetadata;
    loading: boolean;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, loading }) => {
    if (loading) {
        return <LoadingSkeleton />;
    }

    return (
        <motion.div
            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl overflow-hidden"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="relative mb-6">
                <motion.div
                    className="w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-indigo-200 shadow-inner"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                >
                    <Image
                        src={group?.imageUrl || 'https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_640.png'}
                        alt={group?.subject}
                        className="w-full h-full object-cover"
                    />
                </motion.div>
                {group?.isCommunity && (
                    <motion.div
                        className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-full"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        Community
                    </motion.div>
                )}
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-2 truncate">{group?.subject}</h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2 hover:line-clamp-none transition-all duration-300">
                {group?.desc || 'No description available'}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
                <InfoItem icon={<Users size={18} />} text={`${group?.size} members`} />
                <InfoItem
                    icon={<Calendar size={18} />}
                    text={group?.creation ? new Date(group.creation * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                />
                <InfoItem icon={group?.restrict ? <Lock size={18} /> : <Shield size={18} />} text={group?.restrict ? 'Restricted' : 'Open'} />
                <InfoItem icon={<MessageCircle size={18} />} text={group?.announce ? 'Announcement Only' : 'Open Chat'} />
            </div>

            <motion.div
                className="flex justify-between items-center text-xs text-gray-500 border-t border-gray-200 pt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <span className="flex items-center">
                    <User size={14} className="mr-1" />
                    Owner: {group?.owner?.split('@')[0] || 'Unknown'}
                </span>
                <span>{group?.joinApprovalMode ? 'Approval Required' : 'Open Join'}</span>
            </motion.div>
        </motion.div>
    );
};

const InfoItem: React.FC<{ icon: React.ReactNode, text: string }> = ({ icon, text }) => (
    <motion.div
        className="flex items-center text-sm text-gray-700 bg-gray-100 rounded-full px-3 py-1"
        whileHover={{ scale: 1.05, backgroundColor: '#EEF2FF' }}
    >
        <span className="mr-2 text-indigo-500">{icon}</span>
        <span className="truncate">{text}</span>
    </motion.div>
);

const LoadingSkeleton = () => (
    <motion.div
        className="bg-white rounded-2xl shadow-lg p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
    >
        <div className="w-28 h-28 bg-gray-300 rounded-full mb-6 mx-auto animate-pulse"></div>
        <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto mb-3 animate-pulse"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-3 animate-pulse"></div>
        <div className="grid grid-cols-2 gap-3 mb-4">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-300 rounded-full animate-pulse"></div>
            ))}
        </div>
        <div className="h-4 bg-gray-300 rounded w-full mx-auto animate-pulse"></div>
    </motion.div>
);

export default GroupCard;
