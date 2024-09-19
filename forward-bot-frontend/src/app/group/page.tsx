"use client";

import React, { useState, useEffect } from 'react';
import { Search, Plus, X, ArrowRight, ClipboardCheckIcon, AlertCircle } from 'lucide-react';
import GroupCard from '../components/GroupCard';
import { motion, AnimatePresence } from 'framer-motion';
import { GroupParticipant } from '@whiskeysockets/baileys';

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


interface Rule {
    id: number;
    from: string;
    to: string;
    fromName: string;
    toName: string;
}

export interface GroupCardProps {
    group?: GroupMetadata;
    loading: boolean;
}

interface ForwardingRuleProps {
    rule: Rule;
    groups: GroupMetadata[];
    onDelete: (id: number) => void;
    onChange: (id: number, field: 'from' | 'to', value: string) => void;
}


const ForwardingRule: React.FC<ForwardingRuleProps> = ({ rule, groups, onDelete, onChange }) => {
    return (
        <div className="flex space-x-4 items-center mb-4 bg-gray-50 p-4 rounded-lg">
            <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">From:</label>
                <select
                    value={rule.from}
                    onChange={(e) => onChange(rule.id, 'from', e.target.value)}
                    className="text-black w-full p-2 rounded-md border border-gray-300 focus:ring-gray-500 focus:border-gray-500"
                >
                    <option value="">Select a group</option>
                    {groups.map((group) => (
                        <option
                            key={group.id}
                            value={group.id}
                            className="
    text-indigo-700 
    bg-gradient-to-r from-purple-50 to-indigo-50
    hover:bg-gradient-to-r hover:from-purple-200 hover:to-indigo-200
    transition-all duration-300 ease-in-out
    font-semibold
    py-3 px-5
    rounded-lg
    shadow-md hover:shadow-lg
    cursor-pointer
    outline-none
    focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-50
    transform hover:scale-105
    border-l-4 border-indigo-500
    backdrop-filter backdrop-blur-sm
    animate-pulse
  "
                        >
                            {group.subject}
                        </option>

                    ))}
                </select>
            </div>
            <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">To:</label>
                <select
                    value={rule.to}
                    onChange={(e) => onChange(rule.id, 'to', e.target.value)}
                    className="text-red-800 w-full p-2 rounded-md border border-gray-300 focus:ring-gray-500 focus:border-gray-500"
                >
                    <option value="">Select a group</option>
                    {groups.map((group) => (
                        <option key={group.id} value={group.id}>{group.subject}</option>
                    ))}
                </select>
            </div>
            <button onClick={() => onDelete(rule.id)} className="text-red-500 hover:text-red-700 p-2 mt-6 bg-gray-300 rounded">
                <X size={20} />
            </button>
        </div>
    );
};

const LightgrayColorPaletteGroups: React.FC = () => {
    const API = process.env.NEXT_PUBLIC_API;
    const [groups, setGroups] = useState<GroupMetadata[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [forwardingRules, setForwardingRules] = useState<Rule[]>([]);
    const [showSaveChanges, setShowSaveChanges] = useState<boolean>(false);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [groupToDelete, setGroupToDelete] = useState<string | null>(null);

    const confirmDelete = (groupId: string | null) => {
        setGroupToDelete(groupId);
    };

    const cancelDelete = () => {
        setGroupToDelete(null);
    };

    const executeDelete = () => {
        if (groupToDelete) {
            handleDeleteGroup(groupToDelete);
            setGroupToDelete(null);
        }
    };

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await fetch(`${API}whatsapp/groups/1`);
                const data = await response.json();
                if (data.success) {
                    setGroups(data.groups);
                    setLoading(false);
                }

                // Fetch selected groups
                const selectedResponse = await fetch(`${API}chats/1`);
                const selectedData = await selectedResponse.json();
                if (selectedData.chats) {
                    setSelectedGroups(selectedData.chats);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);

    const handleDeleteGroup = async (groupId: string) => {
        try {
            const response = await fetch(`${API}chats/${groupId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setSelectedGroups(selectedGroups.filter(group => group.id !== groupId));
            } else {
                console.error('Failed to delete group');
            }
        } catch (error) {
            console.error('Error deleting group:', error);
        }
    };


    const filteredGroups = groups.filter((group) =>
        group.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addForwardingRule = () => {
        setForwardingRules([...forwardingRules, { id: Date.now(), from: '', to: '', fromName: '', toName: '' }]);
        setShowSaveChanges(true);
    };

    const removeForwardingRule = (id: number) => {
        setForwardingRules(forwardingRules.filter((rule) => rule.id !== id));
        setShowSaveChanges(true);
    };

    const updateForwardingRule = (id: number, field: 'from' | 'to', value: string) => {
        setForwardingRules(
            forwardingRules.map((rule) => {
                if (rule.id === id) {
                    const updatedRule = { ...rule, [field]: value };
                    // Update the corresponding name field
                    if (field === 'from') {
                        updatedRule.fromName = groups.find(g => g.id === value)?.subject || '';
                    } else if (field === 'to') {
                        updatedRule.toName = groups.find(g => g.id === value)?.subject || '';
                    }
                    return updatedRule;
                }
                return rule;
            })
        );
        setShowSaveChanges(true);
    };

    const saveChanges = async () => {
        console.log('Saving changes...', forwardingRules);

        const formattedRules = forwardingRules.map(rule => ({
            userID: "1", // Assuming user ID is always 1 for this example
            fromJid: rule.from,
            toJid: rule.to,
            fromJidName: rule.fromName,
            toJidName: rule.toName,
            timestamp: new Date().toISOString()
        }));

        try {
            const response = await fetch(`${API}chats`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedRules),
            });

            if (response.ok) {
                console.log('Forwarding rules saved successfully');
                setShowSaveChanges(false);
            } else {
                console.error('Failed to save forwarding rules');
            }
        } catch (error) {
            console.error('Error saving forwarding rules:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-100 p-8 font-sans">
            <h1 className="text-4xl font-bold text-gray-600 mb-8 text-center">Group Management</h1>

            {/* Message Forwarding Section */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8 max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-600 mb-6">Message Forwarding</h2>

                {forwardingRules.map((rule) => (
                    <ForwardingRule
                        key={rule.id}
                        rule={rule}
                        groups={groups}
                        onDelete={removeForwardingRule}
                        onChange={updateForwardingRule}
                    />
                ))}
                <button
                    onClick={addForwardingRule}
                    className="flex items-center justify-center w-full bg-gray-100 text-gray-600 py-3 rounded-md hover:bg-gray-200 transition-colors duration-300 mt-4"
                >
                    <Plus size={20} className="mr-2" /> Add Another Forwarding Rule
                </button>

                {/* Previously Selected Groups Section */}
                <section className="mt-12 bg-gradient-to-br from-indigo-50 to-blue-100 rounded-xl p-8 shadow-lg font-sans">
                    <h2 className="text-3xl font-extrabold mb-6 flex items-center text-indigo-800">
                        <ClipboardCheckIcon size={32} className="mr-3 text-indigo-600" />
                        Previously Selected Groups
                    </h2>

                    <AnimatePresence>
                        {selectedGroups.length === 0 ? (
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="text-gray-600 italic text-lg"
                            >
                                No groups selected yet.
                            </motion.p>
                        ) : (
                            <motion.div layout className="space-y-4">
                                {selectedGroups.map((group) => (
                                    <motion.div
                                        key={group.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between hover:shadow-lg transition-shadow duration-300"
                                    >
                                        <div className="flex-grow">
                                            <div className="flex items-center mb-3">
                                                <ArrowRight size={18} className="text-emerald-500 mr-3" />
                                                <span className="font-semibold mr-2 text-gray-700">From:</span>
                                                <span className="text-indigo-600">{group.fromjidName}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <ArrowRight size={18} className="text-rose-500 mr-3" />
                                                <span className="font-semibold mr-2 text-gray-700">To:</span>
                                                <span className="text-indigo-600">{group.toJidName}</span>
                                            </div>
                                        </div>
                                        {groupToDelete === group.id ? (
                                            <div className="flex items-center">
                                                <button
                                                    onClick={executeDelete}
                                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 mr-2"
                                                >
                                                    Confirm
                                                </button>
                                                <button
                                                    onClick={cancelDelete}
                                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => confirmDelete(group.id)}
                                                className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                                                aria-label="Delete group"
                                            >
                                                <X size={20} />
                                            </button>
                                        )}
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {selectedGroups.length > 0 && (
                        <div className="mt-6 flex items-center text-gray-600">
                            <AlertCircle size={18} className="mr-2 text-indigo-500" />
                            <span className="text-sm">Click the delete button to remove a group.</span>
                        </div>
                    )}
                </section>

            </div>

            {/* Search Bar */}
            <div className="relative mb-8 max-w-2xl mx-auto">
                <input
                    type="text"
                    placeholder="Search groups..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-4 pl-12 rounded-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent shadow-md text-black"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
            </div>

            {/* Group Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {loading
                    ? Array(6)
                        .fill(null)
                        .map((_, index) => <GroupCard key={index} loading={true} />)
                    : filteredGroups.map((group) => <GroupCard key={group.id} group={group} loading={false} />)}
            </div>

            {/* Save Changes Button */}
            {showSaveChanges && (
                <button
                    onClick={saveChanges}
                    className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg hover:bg-blue-600 transition-colors duration-300"
                >
                    Save Changes
                </button>
            )}
        </div>
    );
};

export default LightgrayColorPaletteGroups;
