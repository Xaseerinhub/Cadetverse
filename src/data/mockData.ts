import { 
  CadetCollegeCode, 
  CadetUser, 
  Post, 
  Story, 
  Community, 
  ChatConversation, 
  Announcement, 
  NotificationItem, 
  VerificationRequest 
} from '../types';
import { CADET_COLLEGES_DATA } from './cadetColleges';
import {
  CADET_CAMPUS_GROUNDS_IMAGE,
  CADET_PARADE_FORMATION_IMAGE,
  CADET_REUNION_GALA_IMAGE,
  CADET_ATHLETICS_EVENT_IMAGE,
} from '../assets/cadetImages';

export const CADET_COLLEGES = CADET_COLLEGES_DATA.map((c) => ({
  code: c.abbreviation,
  name: c.name,
  established: c.established,
  location: c.location,
  motto: c.motto,
  houses: c.houses.map((h) => h.name),
  alumniAssoc: `${c.alumniAssociation.name} (${c.alumniAssociation.abbreviation})`,
}));

export const DEMO_USERS: CadetUser[] = [
  {
    id: 'user_1',
    name: 'Dr. Tanvir Ahsan',
    cadetNumber: '1428',
    college: 'Mirzapur Cadet College',
    collegeCode: 'MCC',
    intake: 44,
    house: 'Fazlul Huq House',
    houseColor: '#3b82f6',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    coverImage: CADET_CAMPUS_GROUNDS_IMAGE,
    role: 'alumnus',
    profession: 'Senior AI Research Engineer',
    companyOrOrg: 'Google DeepMind & Cadet Tech Forum',
    location: 'Dhaka / Mountain View',
    bio: 'MCC Intake 44 · Cadet #1428 · Fazlul Huq House Color Holder. Passionate about machine learning systems, cross-cadet mentorship, and alumni initiatives.',
    joinedDate: 'Joined CadetVerse March 2024',
    isVerifiedAlumnus: true,
    stats: {
      posts: 38,
      connections: 614,
      batchmatesCount: 52
    },
    badges: ['Color Holder (Athletics)', 'MECA Life Member', 'College Prefect 2014', 'Tech Mentor']
  },
  {
    id: 'user_2',
    name: 'Dr. Nafis Iqbal',
    cadetNumber: '984',
    college: 'Faujdarhat Cadet College',
    collegeCode: 'FCC',
    intake: 39,
    house: 'Rabindra House',
    houseColor: '#eab308',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    coverImage: CADET_PARADE_FORMATION_IMAGE,
    role: 'alumnus',
    profession: 'Consultant Cardiologist & Professor',
    companyOrOrg: 'National Heart Foundation & OFA Health Wing',
    location: 'Chittagong, Bangladesh',
    bio: 'Old Fauji · 39th Intake · Rabindra House. Serving the health fraternity. Always proud of the red hill road leading up to the parade ground.',
    joinedDate: 'Joined January 2024',
    isVerifiedAlumnus: true,
    stats: {
      posts: 64,
      connections: 1120,
      batchmatesCount: 48
    },
    badges: ['OFA Gold Pin', 'Inter-House Debate Champ', 'Cadet Doctor Guild Lead']
  },
  {
    id: 'user_3',
    name: 'Samira Mehnaz',
    cadetNumber: '412',
    college: 'Mymensingh Girls\' Cadet College',
    collegeCode: 'MGCC',
    intake: 14,
    house: 'Satya House',
    houseColor: '#10b981',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    coverImage: CADET_REUNION_GALA_IMAGE,
    role: 'alumnus',
    profession: 'VP of Product Design',
    companyOrOrg: 'FinTech Hub & Girls Cadet Alumni Circle',
    location: 'Dhaka, Bangladesh',
    bio: 'MGCC 14th Intake · Satya House Captain. Building products, championing women leaders in technology and public policy.',
    joinedDate: 'Joined February 2024',
    isVerifiedAlumnus: true,
    stats: {
      posts: 42,
      connections: 780,
      batchmatesCount: 45
    },
    badges: ['House Captain', 'Literary Cup Winner', 'CCCL Member']
  },
  {
    id: 'user_4',
    name: 'Kazi Farhan Ahmed',
    cadetNumber: '2105',
    college: 'Rajshahi Cadet College',
    collegeCode: 'RCC',
    intake: 52,
    house: 'Qasim House',
    houseColor: '#1e3a8a',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    coverImage: CADET_ATHLETICS_EVENT_IMAGE,
    role: 'prefect',
    profession: 'College Prefect & Graduating Cadet',
    companyOrOrg: 'Rajshahi Cadet College Batch 2025',
    location: 'Sarda, Rajshahi',
    bio: 'RCC Intake 52 · Cadet #2105 · Qasim House. Leading the guard of honor and organizing the 2026 Inter-House Volleyball championship.',
    joinedDate: 'Joined August 2024',
    isVerifiedAlumnus: false,
    stats: {
      posts: 19,
      connections: 340,
      batchmatesCount: 50
    },
    badges: ['College Prefect', 'Best Shot 2024', 'Basketball Color']
  }
];

export const INITIAL_STORIES: Story[] = [
  {
    id: 'story_1',
    author: DEMO_USERS[0],
    imageUrl: CADET_CAMPUS_GROUNDS_IMAGE,
    caption: 'Evening dusk over the parade ground. Nothing beats the quiet after evening roll call.',
    timestamp: '2h ago',
    hasUnseen: true
  },
  {
    id: 'story_2',
    author: DEMO_USERS[1],
    imageUrl: CADET_PARADE_FORMATION_IMAGE,
    caption: 'Annual Passing Out Parade inspection squad in full swing!',
    timestamp: '4h ago',
    hasUnseen: true
  },
  {
    id: 'story_3',
    author: DEMO_USERS[2],
    imageUrl: CADET_REUNION_GALA_IMAGE,
    caption: 'Batch 14 reunion gala kickoff at Cadet College Club. Memories coming back.',
    timestamp: '6h ago',
    hasUnseen: false
  },
  {
    id: 'story_4',
    author: DEMO_USERS[3],
    imageUrl: CADET_ATHLETICS_EVENT_IMAGE,
    caption: 'Final 400m sprint for Qasim House! Spirit of sportsmanship at its peak.',
    timestamp: '8h ago',
    hasUnseen: false
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post_1',
    author: DEMO_USERS[0],
    content: 'Stepping back onto the Mirzapur Cadet College parade ground after 10 years. Looking at the clock tower lit up against the twilight sky brings back memories of 05:30 morning PT whistles, the brisk chill of winter muster, and the unbreakable bond of 50 boys who arrived as strangers and left as brothers for life.\n\nTo all intake batchmates worldwide: our grand batch reunion registration is now officially live on CadetVerse!',
    collegeTag: 'MCC',
    intakeTag: 44,
    timestamp: '18 minutes ago',
    likesCount: 142,
    commentsCount: 19,
    repostsCount: 12,
    isLiked: true,
    isSaved: true,
    image: CADET_CAMPUS_GROUNDS_IMAGE,
    tags: ['MCC44', 'Brotherhood', 'CadetLife', 'Nostalgia', 'AlumniReunion'],
    pinned: true,
    comments: [
      {
        id: 'c1',
        author: DEMO_USERS[1],
        text: 'Those red brick corridors have an eternal soul. Fauji brothers send our warmest regards to the 44th Intake!',
        timestamp: '12m ago',
        likes: 14
      },
      {
        id: 'c2',
        author: DEMO_USERS[2],
        text: 'The bond never fades with distance or time. Looking forward to meeting all at the annual CCCL get-together.',
        timestamp: '6m ago',
        likes: 8
      }
    ]
  },
  {
    id: 'post_2',
    author: DEMO_USERS[3],
    content: 'Historic day at Rajshahi Cadet College! The Inter-House Athletics Final 2026 just concluded. The 4x100m relay anchor leg went down to 0.08 seconds between Qasim House and Khalid House.\n\nCongratulations to all athletes, House Masters, and house prefects who maintained peak discipline throughout the meet.',
    collegeTag: 'RCC',
    intakeTag: 52,
    timestamp: '2 hours ago',
    likesCount: 89,
    commentsCount: 24,
    repostsCount: 9,
    isLiked: false,
    isSaved: false,
    image: CADET_ATHLETICS_EVENT_IMAGE,
    tags: ['RCC', 'InterHouseAthletics', 'Discipline', 'Sportsmanship'],
    poll: {
      question: 'Which event in Cadet College annual athletics carried the highest house prestige?',
      options: [
        { id: 'opt_1', text: 'Cross Country (8 KM)', votes: 124 },
        { id: 'opt_2', text: '4x100m Inter-House Relay', votes: 189 },
        { id: 'opt_3', text: 'Obstacle Course Challenge', votes: 156 },
        { id: 'opt_4', text: '1500m Steeplechase', votes: 47 }
      ],
      totalVotes: 516,
      userVotedId: 'opt_2'
    },
    comments: [
      {
        id: 'c3',
        author: DEMO_USERS[0],
        text: 'Qasim House spirit remains unbeatable! Proud of the juniors continuing the legacy.',
        timestamp: '1h ago',
        likes: 9
      }
    ]
  },
  {
    id: 'post_3',
    author: DEMO_USERS[1],
    content: 'Notice for all ex-cadet medical practitioners across Bangladesh and overseas: The Cadet Doctors Guild is assembling the volunteer medical camp for the 50-Year Golden Jubilee Reunion. We are offering free specialized health screenings, cardiology diagnostics, and eye camps for neighboring community schools in Sitakunda.\n\nPlease comment or reach out via direct message to register your roster availability.',
    collegeTag: 'FCC',
    intakeTag: 39,
    timestamp: '4 hours ago',
    likesCount: 215,
    commentsCount: 37,
    repostsCount: 41,
    isLiked: true,
    isSaved: true,
    tags: ['CadetDoctors', 'CommunityService', 'OldFauji', 'HealthcareInitiative'],
    comments: [
      {
        id: 'c4',
        author: DEMO_USERS[0],
        text: 'Count me in for sponsoring the diagnostic software licenses. Noble initiative as always, Nafis Bhai!',
        timestamp: '3h ago',
        likes: 12
      }
    ]
  },
  {
    id: 'post_4',
    author: DEMO_USERS[2],
    content: 'A sneak peek from the MGCC Alumni Circle leadership conclave. 85 alumni women across technology, administration, armed forces, and civil services gathered this weekend. We launched the Cadet Career Mentorship portal on CadetVerse to guide Class 11 and 12 cadets through university admissions and overseas scholarships.',
    collegeTag: 'MGCC',
    intakeTag: 14,
    timestamp: '7 hours ago',
    likesCount: 168,
    commentsCount: 15,
    repostsCount: 22,
    isLiked: false,
    isSaved: false,
    image: CADET_REUNION_GALA_IMAGE,
    tags: ['MGCC', 'Mentorship', 'WomenLeaders', 'CadetPride'],
    comments: []
  },
  {
    id: 'post_5',
    author: {
      ...DEMO_USERS[1],
      name: 'Major Rezwanul Kabir (Retd.)',
      cadetNumber: '812',
      college: 'Jhenaidah Cadet College',
      collegeCode: 'JCC',
      intake: 26,
      house: 'Badr House'
    },
    content: 'To the young cadets currently preparing for the Inter-Cadet Literary and Cultural Competition (ICLCC): remember that elocution, extempore speech, and stage presence learned in that auditorium will define how you speak before boardrooms, tribunals, and command summits 30 years from now. Give it your entire heart.',
    collegeTag: 'JCC',
    intakeTag: 26,
    timestamp: '11 hours ago',
    likesCount: 310,
    commentsCount: 42,
    repostsCount: 56,
    isLiked: false,
    isSaved: false,
    image: CADET_PARADE_FORMATION_IMAGE,
    tags: ['CadetWisdom', 'ICLCC', 'Leadership', 'JEXCA'],
    comments: []
  }
];

export const INITIAL_COMMUNITIES: Community[] = [
  {
    id: 'comm_global',
    name: 'Global Cadet Lounge & Commons',
    code: 'GLOBAL',
    type: 'global',
    category: 'Universal Hub',
    memberCount: 8420,
    description: 'The central gathering space for cadets and ex-cadets from all 12 colleges across all generations.',
    isJoined: true,
    recentTopic: 'Who had the toughest obstacle course in Bangladesh?',
    badge: 'Universal'
  },
  {
    id: 'comm_fcc',
    name: 'Faujdarhat Cadet College Hub',
    code: 'FCC',
    type: 'college',
    category: 'College Wing',
    memberCount: 2450,
    description: 'Old Fauji Association official nexus. Babar, Shahjahan, Akbar, Rabindra, and Fazlul Huq house archives.',
    isJoined: false,
    recentTopic: 'OFA Winter Golf Tournament 2026',
    badge: 'Est. 1958'
  },
  {
    id: 'comm_mcc',
    name: 'Mirzapur Cadet College Hub',
    code: 'MCC',
    type: 'college',
    category: 'College Wing',
    memberCount: 2890,
    description: 'Mirzapur Ex-Cadets Association (MECA) official space. Intakes 1st to 60th discussion boards.',
    isJoined: true,
    recentTopic: 'MECA Grand Reunion 2026 registrations live',
    badge: 'Est. 1963'
  },
  {
    id: 'comm_rcc',
    name: 'Rajshahi Cadet College Hub',
    code: 'RCC',
    type: 'college',
    category: 'College Wing',
    memberCount: 2130,
    description: 'Old Rajshahi Cadets Association (ORCA). Sarda campus news, inter-house debates, and alumni directory.',
    isJoined: false,
    recentTopic: 'ORCA Medical Aid Fund distribution report',
    badge: 'Est. 1966'
  },
  {
    id: 'comm_mgcc',
    name: 'Mymensingh Girls\' Cadet College Hub',
    code: 'MGCC',
    type: 'college',
    category: 'College Wing',
    memberCount: 1670,
    description: 'Official forum for MGCC alumni and cadets. Celebrating leadership, sisterhood, and excellence.',
    isJoined: true,
    recentTopic: 'STEM Career Day panelist lineup announcement',
    badge: 'Est. 1982'
  },
  {
    id: 'comm_tech',
    name: 'Cadet Tech Founders & Engineers',
    code: 'TECH',
    type: 'wing',
    category: 'Professional Guild',
    memberCount: 1420,
    description: 'Ex-cadets working in Silicon Valley, Singapore, Europe, and Bangladesh building tech startups and AI systems.',
    isJoined: true,
    recentTopic: 'Cadet Seed Angel Syndicate batch 2026',
    badge: 'Guild'
  },
  {
    id: 'comm_med',
    name: 'Cadet Medical Fraternity & Doctors Guild',
    code: 'MED',
    type: 'wing',
    category: 'Professional Guild',
    memberCount: 1890,
    description: 'Doctors, surgeons, and healthcare leaders from all 12 cadet colleges collaborating on free medical camps.',
    isJoined: false,
    recentTopic: 'Tele-consultation portal for elderly ex-cadets',
    badge: 'Guild'
  },
  {
    id: 'comm_forces',
    name: 'Defence & Armed Forces Wing',
    code: 'DEF',
    type: 'wing',
    category: 'Professional Guild',
    memberCount: 1350,
    description: 'Commissioned officers and veterans serving in Bangladesh Army, Navy, Air Force, and UN Peacekeeping.',
    isJoined: false,
    recentTopic: 'Cadet ISSB preparation guidelines 2026',
    badge: 'Guild'
  },
  {
    id: 'comm_intake44',
    name: 'MCC 44th Intake Fraternity',
    code: 'MCC-44',
    type: 'intake',
    category: 'Intake Network',
    memberCount: 52,
    description: 'Private intake circle for the 44th batch of Mirzapur Cadet College. Batch welfare, family meets, and archives.',
    isJoined: true,
    recentTopic: 'Reunion souvenir book photo submission deadline',
    badge: 'Batch'
  }
];

export const INITIAL_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'chat_1',
    participant: DEMO_USERS[1], // Dr. Nafis
    lastMessage: 'Let’s sync on the medical tent setup for the reunion weekend.',
    lastMessageTime: '10:45 AM',
    unreadCount: 1,
    isOnline: true,
    messages: [
      {
        id: 'm1',
        senderId: 'user_2',
        senderName: 'Dr. Nafis Iqbal',
        senderAvatar: DEMO_USERS[1].avatar,
        text: 'Salam Tanvir, saw your post on the cadet platform. Wonderful to see CadetVerse taking shape.',
        timestamp: '10:30 AM',
        isFromMe: false
      },
      {
        id: 'm2',
        senderId: 'user_1',
        senderName: 'Dr. Tanvir Ahsan',
        senderAvatar: DEMO_USERS[0].avatar,
        text: 'Waleikum Assalam Nafis Bhai! Really appreciate it. How is the OFA medical camp preparations going?',
        timestamp: '10:35 AM',
        isFromMe: true
      },
      {
        id: 'm3',
        senderId: 'user_2',
        senderName: 'Dr. Nafis Iqbal',
        senderAvatar: DEMO_USERS[1].avatar,
        text: 'We have 24 doctors onboard already. Let’s sync on the medical tent setup for the reunion weekend.',
        timestamp: '10:45 AM',
        isFromMe: false
      }
    ]
  },
  {
    id: 'chat_2',
    participant: DEMO_USERS[2], // Samira
    lastMessage: 'Sent you the Figma prototype for the Cadet Career Portal!',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    isOnline: false,
    messages: [
      {
        id: 'm4',
        senderId: 'user_3',
        senderName: 'Samira Mehnaz',
        senderAvatar: DEMO_USERS[2].avatar,
        text: 'Hey Tanvir, did you get a chance to review the mentorship guidelines draft?',
        timestamp: 'Yesterday 3:15 PM',
        isFromMe: false
      },
      {
        id: 'm5',
        senderId: 'user_1',
        senderName: 'Dr. Tanvir Ahsan',
        senderAvatar: DEMO_USERS[0].avatar,
        text: 'Yes! The House-wise mentor pairing structure is brilliant.',
        timestamp: 'Yesterday 3:40 PM',
        isFromMe: true
      },
      {
        id: 'm6',
        senderId: 'user_3',
        senderName: 'Samira Mehnaz',
        senderAvatar: DEMO_USERS[2].avatar,
        text: 'Sent you the Figma prototype for the Cadet Career Portal!',
        timestamp: 'Yesterday 4:02 PM',
        isFromMe: false
      }
    ]
  },
  {
    id: 'chat_3',
    participant: DEMO_USERS[3], // Kazi Farhan
    lastMessage: 'Thank you for the guidance on the athletics cup speech, Bhai.',
    lastMessageTime: 'Nov 4',
    unreadCount: 0,
    isOnline: true,
    messages: [
      {
        id: 'm7',
        senderId: 'user_4',
        senderName: 'Kazi Farhan Ahmed',
        senderAvatar: DEMO_USERS[3].avatar,
        text: 'Bhai, could you give some tips on the prefect address for the upcoming sports week?',
        timestamp: 'Nov 4 2:00 PM',
        isFromMe: false
      },
      {
        id: 'm8',
        senderId: 'user_1',
        senderName: 'Dr. Tanvir Ahsan',
        senderAvatar: DEMO_USERS[0].avatar,
        text: 'Focus on collective humility and house honor. Keep it crisp, under 3 minutes, and honor the ground staff who maintained the tracks.',
        timestamp: 'Nov 4 2:30 PM',
        isFromMe: true
      },
      {
        id: 'm9',
        senderId: 'user_4',
        senderName: 'Kazi Farhan Ahmed',
        senderAvatar: DEMO_USERS[3].avatar,
        text: 'Thank you for the guidance on the athletics cup speech, Bhai.',
        timestamp: 'Nov 4 3:10 PM',
        isFromMe: false
      }
    ]
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann_1',
    title: 'MECA Grand Reunion 2026: Official Date & Registration Protocol',
    issuer: 'Mirzapur Ex-Cadets Association (MECA) Central Council',
    issuerRole: 'Governing Executive Committee',
    date: 'November 05, 2026',
    category: 'Reunion',
    content: 'The Central Council of MECA is pleased to announce the 16th Grand Reunion to be celebrated on campus at Mirzapur Cadet College from January 15–17, 2027. All alumni from Intakes 1 to 58 are requested to verify their Cadet Numbers on CadetVerse to secure priority passes, dormitory bookings, and commemorative blazer crests.',
    isPinned: true,
    actionText: 'Register for Reunion Pass',
    actionUrl: '#',
    location: 'Mirzapur Cadet College, Tangail'
  },
  {
    id: 'ann_2',
    title: 'Cadet College Club Limited (CCCL) Annual Golf & Family Gala 2026',
    issuer: 'Cadet College Club Limited (CCCL) Purbachal',
    issuerRole: 'Board of Governors',
    date: 'November 01, 2026',
    category: 'CCCL',
    content: 'The 22nd Annual CCCL Golf Cup and Family Weekend will be hosted at Kurmitola Golf Club and CCCL Purbachal premises. Ex-cadet members across all 12 colleges are invited to compete in individual and inter-college team strokeplay categories.',
    isPinned: true,
    actionText: 'View Tee Off Schedule',
    actionUrl: '#',
    location: 'Kurmitola Golf Club & CCCL Purbachal'
  },
  {
    id: 'ann_3',
    title: 'Cadet Welfare Trust: Higher Education Global Scholarship Cohort 2026',
    issuer: 'Inter-Cadet Welfare Foundation (ICWF)',
    issuerRole: 'Trustee Board',
    date: 'October 28, 2026',
    category: 'Scholarship',
    content: 'Applications are now open for the ICWF Higher Education Fellowship, granting up to $15,000 for deserving cadet college graduates accepted into top tier international universities for Master’s and Doctoral programs in Engineering, Medicine, and Public Policy.',
    isPinned: false,
    actionText: 'Download Application Packet',
    actionUrl: '#',
    location: 'Dhaka, Bangladesh'
  },
  {
    id: 'ann_4',
    title: 'Condolence Notice: Remembering Lt. Col. M. A. Latif (Retd.)',
    issuer: 'Cadet College Council & Adjutant General\'s Branch',
    issuerRole: 'Directorate of Military Training',
    date: 'October 20, 2026',
    category: 'Obituary',
    content: 'With profound grief, we announce the passing of former Principal of Faujdarhat and Mirzapur Cadet Colleges. His exemplary mentorship of five generations of cadets established foundational standards of honor, academic vigor, and selflessness. Special doa mahfil will be held this Friday at CCCL.',
    isPinned: false,
    actionText: 'Leave Condolence Note',
    actionUrl: '#'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    type: 'like',
    title: 'Dr. Nafis Iqbal liked your post',
    description: '"Stepping back onto the Mirzapur Cadet College parade ground..."',
    timestamp: '15m ago',
    read: false,
    avatar: DEMO_USERS[1].avatar
  },
  {
    id: 'notif_2',
    type: 'comment',
    title: 'Samira Mehnaz commented on your post',
    description: '"The bond never fades with distance or time. Looking forward to meeting all..."',
    timestamp: '42m ago',
    read: false,
    avatar: DEMO_USERS[2].avatar
  },
  {
    id: 'notif_3',
    type: 'batch',
    title: 'New discussion in MCC 44th Intake Fraternity',
    description: '3 new batchmates uploaded retro photos from 2008 Obstacle Course meet.',
    timestamp: '2h ago',
    read: false
  },
  {
    id: 'notif_4',
    type: 'announcement',
    title: 'Official Notice: MECA Reunion 2026 registration opened',
    description: 'Click to secure your commemorative entry token and batch table.',
    timestamp: '1d ago',
    read: true
  },
  {
    id: 'notif_5',
    type: 'verification',
    title: 'Cadet Profile Badge Verified',
    description: 'Your Cadet No. #1428 has been cross-referenced with MECA records.',
    timestamp: '3d ago',
    read: true
  }
];

export const INITIAL_VERIFICATIONS: VerificationRequest[] = [
  {
    id: 'ver_1',
    cadetName: 'Rashidul Hasan',
    college: 'Faujdarhat Cadet College',
    cadetNumber: '1102',
    intake: 41,
    house: 'Shahidullah House',
    graduatingYear: 2011,
    submittedAt: 'Today, 2:15 PM',
    proofDocument: 'College Leaving Certificate #FCC-2011-1102 (PDF)',
    status: 'pending'
  },
  {
    id: 'ver_2',
    cadetName: 'Tazeen Sharmin',
    college: 'Feni Girls\' Cadet College',
    cadetNumber: '184',
    intake: 6,
    house: 'Ayesha House',
    graduatingYear: 2015,
    submittedAt: 'Yesterday, 8:40 PM',
    proofDocument: 'FGCC Old Cadets Association Membership Card (JPG)',
    status: 'pending'
  },
  {
    id: 'ver_3',
    cadetName: 'Shahriar Mahmud',
    college: 'Barisal Cadet College',
    cadetNumber: '954',
    intake: 29,
    house: 'Sher-e-Bangla House',
    graduatingYear: 2007,
    submittedAt: 'Nov 04, 2026',
    proofDocument: 'HSC Transcript & Cadet ID Scan (PNG)',
    status: 'verified'
  }
];
