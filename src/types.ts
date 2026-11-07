import type {
  CadetCollegeCode,
  CollegeCategory,
  HouseColour,
  House,
  AlumniAssociation,
  CadetCollege,
} from './data/cadetColleges';

export type {
  CadetCollegeCode,
  CollegeCategory,
  HouseColour,
  House,
  AlumniAssociation,
  CadetCollege,
};

export interface CadetUser {
  id: string;
  name: string;
  cadetNumber: string; // e.g. "1428"
  college: string; // "Mirzapur Cadet College"
  collegeCode: CadetCollegeCode;
  intake: number; // e.g. 44
  house: string; // "Fazlul Huq House"
  houseColor: string; // e.g. "#3b82f6"
  avatar: string;
  coverImage?: string;
  role: 'cadet' | 'alumnus' | 'prefect' | 'admin';
  profession: string;
  companyOrOrg?: string;
  location: string;
  bio: string;
  joinedDate: string;
  isVerifiedAlumnus: boolean;
  stats: {
    posts: number;
    connections: number;
    batchmatesCount: number;
  };
  badges: string[];
}

export interface PostComment {
  id: string;
  author: CadetUser;
  text: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
}

export interface PostPoll {
  question: string;
  options: {
    id: string;
    text: string;
    votes: number;
  }[];
  totalVotes: number;
  userVotedId?: string;
}

export interface Post {
  id: string;
  author: CadetUser;
  content: string;
  collegeTag?: CadetCollegeCode;
  intakeTag?: number;
  timestamp: string;
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  isLiked: boolean;
  isSaved: boolean;
  image?: string;
  tags: string[];
  poll?: PostPoll;
  comments: PostComment[];
  pinned?: boolean;
}

export interface Story {
  id: string;
  author: CadetUser;
  imageUrl: string;
  caption: string;
  timestamp: string;
  hasUnseen: boolean;
}

export interface Community {
  id: string;
  name: string;
  code: string;
  type: 'college' | 'intake' | 'wing' | 'global';
  category: string;
  memberCount: number;
  description: string;
  isJoined: boolean;
  avatarUrl?: string;
  coverUrl?: string;
  recentTopic: string;
  badge?: string;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isFromMe: boolean;
}

export interface ChatConversation {
  id: string;
  participant: CadetUser;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  messages: DirectMessage[];
}

export interface Announcement {
  id: string;
  title: string;
  issuer: string;
  issuerRole: string;
  date: string;
  category: 'Reunion' | 'Governing Body' | 'CCCL' | 'Sports' | 'Scholarship' | 'Obituary';
  content: string;
  isPinned?: boolean;
  actionText?: string;
  actionUrl?: string;
  location?: string;
}

export interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'mention' | 'batch' | 'announcement' | 'verification';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  avatar?: string;
  sourceId?: string;
}

export interface VerificationRequest {
  id: string;
  cadetName: string;
  college: string;
  cadetNumber: string;
  intake: number;
  house: string;
  graduatingYear: number;
  submittedAt: string;
  proofDocument: string;
  status: 'pending' | 'verified' | 'rejected';
}
