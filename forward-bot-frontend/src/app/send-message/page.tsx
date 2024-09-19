"use client";

import React, { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, X } from 'lucide-react';

type PostType = 'media' | 'text' | 'poll';

interface PollOption {
    id: number;
    text: string;
}

interface Message {
    caption: string;
    sender: string;
    isPrivate: boolean;
    isGroup: boolean;
    groupName?: string;
    isMultiple: boolean;
    recipients?: string[];
    schedule?: string;
    type: PostType;
    pollOptions?: string[];
    media?: {
        filename: string;
        mimetype: string;
    };
}


const PostScheduler: React.FC = () => {
    const router = useRouter();
    const [caption, setCaption] = useState('');
    const [sender, setSender] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [isGroup, setIsGroup] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [isMultiple, setIsMultiple] = useState(false);
    const [recipients, setRecipients] = useState('');
    const [schedule, setSchedule] = useState('');
    const [postType, setPostType] = useState<PostType>('media');
    const [pollOptions, setPollOptions] = useState<PollOption[]>([
        { id: 1, text: '' },
        { id: 2, text: '' },
    ]);
    const [media, setMedia] = useState<File | null>(null);

    const handlePollOptionChange = (id: number, value: string) => {
        setPollOptions(prevOptions =>
            prevOptions.map(option =>
                option.id === id ? { ...option, text: value } : option
            )
        );
    };

    const addPollOption = () => {
        if (pollOptions.length < 11) {
            setPollOptions(prevOptions => [
                ...prevOptions,
                { id: prevOptions.length + 1, text: '' },
            ]);
        }
    };

    const removePollOption = (id: number) => {
        if (pollOptions.length > 2) {
            setPollOptions(prevOptions => prevOptions.filter(option => option.id !== id));
        }
    };

    const handleMediaChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.size <= 25 * 1024 * 1024) { // 25 MB limit
            setMedia(file);
        } else {
            alert('File size exceeds 25 MB limit');
        }
    };

    const serializeMessage = () => {
        const message: Message = {
            caption,
            sender,
            isPrivate,
            isGroup,
            groupName: isGroup ? groupName : undefined,
            isMultiple,
            recipients: isMultiple ? recipients.split(',').map(r => r.trim()) : undefined,
            schedule: schedule ? new Date(schedule).toISOString() : undefined,
            type: postType,
        };

        if (postType === 'poll') {
            message.pollOptions = pollOptions.filter(option => option.text.trim() !== '').map(option => option.text);
        }

        if (media) {
            message.media = {
                filename: media.name,
                mimetype: media.type,
                // In a real implementation, you'd upload the file and include its URL or ID here
            };
        }

        return JSON.stringify(message);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const serializedMessage = serializeMessage();
        console.log('Serialized message:', serializedMessage);
        // Here you would typically send the serializedMessage to your backend
        // await sendMessage(serializedMessage);
        // router.push('/success');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl space-y-6">
                <h1 className="text-2xl font-bold text-gray-800">Schedule a Post</h1>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="caption" className="block text-sm font-medium text-gray-700">Caption</label>
                        <textarea
                            id="caption"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            rows={3}
                            placeholder="Add a caption..."
                        />
                    </div>

                    <div>
                        <label htmlFor="sender" className="block text-sm font-medium text-gray-700">Sender</label>
                        <input
                            type="text"
                            id="sender"
                            value={sender}
                            onChange={(e) => setSender(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            placeholder="Enter sender name"
                        />
                    </div>

                    <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={isPrivate}
                                onChange={(e) => setIsPrivate(e.target.checked)}
                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                            <span className="ml-2 text-sm text-gray-700">Private</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={isGroup}
                                onChange={(e) => setIsGroup(e.target.checked)}
                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                            <span className="ml-2 text-sm text-gray-700">Group</span>
                        </label>
                        {isGroup && (
                            <input
                                type="text"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                placeholder="Enter group name"
                            />
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={isMultiple}
                                onChange={(e) => setIsMultiple(e.target.checked)}
                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                            <span className="ml-2 text-sm text-gray-700">Multiple Recipients</span>
                        </label>
                        {isMultiple && (
                            <input
                                type="text"
                                value={recipients}
                                onChange={(e) => setRecipients(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                placeholder="Enter email addresses, separated by commas"
                            />
                        )}
                    </div>

                    <div>
                        <label htmlFor="schedule" className="block text-sm font-medium text-gray-700">Schedule</label>
                        <input
                            type="datetime-local"
                            id="schedule"
                            value={schedule}
                            onChange={(e) => setSchedule(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Post Type</label>
                        <div className="mt-2 space-x-4">
                            {(['media', 'text', 'poll'] as PostType[]).map((type) => (
                                <label key={type} className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        checked={postType === type}
                                        onChange={() => setPostType(type)}
                                        className="form-radio text-indigo-600"
                                    />
                                    <span className="ml-2 text-gray-700 capitalize">{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {postType === 'media' && (
                        <div>
                            <label htmlFor="media" className="block text-sm font-medium text-gray-700">Upload Media (max 25MB)</label>
                            <input
                                type="file"
                                id="media"
                                onChange={handleMediaChange}
                                accept="image/*,video/*"
                                className="mt-1 block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-indigo-50 file:text-indigo-700
                          hover:file:bg-indigo-100"
                            />
                        </div>
                    )}

                    {postType === 'poll' && (
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Poll Options</label>
                            {pollOptions.map((option, index) => (
                                <div key={option.id} className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={option.text}
                                        onChange={(e) => handlePollOptionChange(option.id, e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        placeholder={`Poll option ${index + 1}`}
                                    />
                                    {index > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removePollOption(option.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X size={20} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            {pollOptions.length < 11 && (
                                <button
                                    type="button"
                                    onClick={addPollOption}
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <PlusCircle size={16} className="mr-2" />
                                    Add Option
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Schedule Post
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostScheduler;