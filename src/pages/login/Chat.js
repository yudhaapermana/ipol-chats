import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Accordion, Button, Card, Carousel, Col, Modal, Row, useAccordionButton } from 'react-bootstrap';
import Avatar from 'components/common/Avatar';
import SvgIcon from 'components/app/kanban/SvgIcon';
import IsiTxt from 'components/form/IsiTxt';
import avatarAdmin from 'assets/img/icons/avatar-admin.png';
import { useBreakpoints } from 'hooks/useBreakpoints';
import useIsMobile from 'hooks/useIsMobile';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as ISI from 'script/ISI.js?2';
import { hubProxy, startConnection } from './ChatService';
import { format, isToday, isYesterday, set } from 'date-fns';
import EmojiPicker from 'emoji-picker-react';
import { useAppContext } from 'Main';
import Linkify from 'react-linkify';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { formatText } from 'helpers/formatText';
import { FCM } from '@capacitor-community/fcm';

const Chat = () => {
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_URL_API;
  const lgdata = JSON.parse(localStorage.getItem('userData'));
  const ERP_URL = process.env.REACT_APP_URL_ERP;
  const MOBILE_URL = process.env.REACT_APP_URL_MOBILE;
  const IPOL_URL = process.env.REACT_APP_URL_IPOL;
  const link = `${BASE_URL}api/Chat`;
  const [isProfile, setIsProfile] = useState(false);
  const [activeRoomId, setActiveRoomId] = useState('');
  const [chat, setChat] = useState(null);
  const [isAdd, setIsAdd] = useState(false);
  const [isGroup, setIsGroup] = useState(false);
  const [isUpload, setIsUpload] = useState(false);
  const [isAttach, setIsAttach] = useState(false);
  const [lsUser, setLsUser] = useState([]);
  const [lsInbox, setLsInbox] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [keyword, setKeyword] = useState('');
  const [keywordIbx, setKeywordIbx] = useState('');
  const [Obj, setObj] = useState({});
  const [page, setPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [isDeleteChat, setIsDeleteChat] = useState(false);
  const [isAddMember, setIsAddMember] = useState(false);
  const [isLeaveGroup, setisLeaveGroup] = useState(false);
  const pendingRoomId = useRef(null);
  const emojiRef = useRef(null);
  const attachRef = useRef(null);
  const iconInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [isDeleteRoom, setIsDeleteRoom] = useState(false);
  const [isIconTrash, setIsIconTrash] = useState(false);
  const [deleteRoomId, setDeleteRoomId] = useState('');
  const [previewIndex, setPreviewIndex] = useState(null);
  const [debugLogs, setDebugLogs] = useState([]);
  const [isDebug, setIsDebug] = useState(false);
  
  const addLog = msg => {
    setDebugLogs(prev => [...prev, msg]);
  };

  const CheckDev = useIsMobile();

  let img = '';
  if (lgdata && lgdata.Link) img = lgdata.Link;

  const endRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const timerRef = useRef(null);

  let { width, height, breakpoints } = useBreakpoints();
  let htab = height - 110;
  let htabe = height - 50;

  const {
    config: { isDark }
  } = useAppContext();

  const formatChatTime = dateString => {
    if (!dateString || dateString === '0001-01-01T00:00:00') return '';

    const date = new Date(dateString);

    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'dd/MM/yy');
    }
  };

  useEffect(() => {
    startConnection();

    hubProxy.on('receiveMessage', msg => {
      const targetRoom = Obj?.ListRoom?.find(r => r.RoomId?.toString() === msg.RoomId?.toString());
      if (msg.RoomId?.toString() === activeRoomId?.toString() && targetRoom?.IsActive == '1') {
        if (msg.Tkn !== lgdata.Keys) {
          setMessages(prev => {
            const isExist = prev.find(item => item.ChatId === msg.ChatId);
            if (isExist) return prev;
            return [...prev, msg];
          });

          if (chat?.IsActive == '1') {
            ResetUnread(activeRoomId);
            const updateRoom = Obj.ListRoom.map(r => {
              if (r.RoomId === activeRoomId && r.IsActive == '1') {
                return { ...r, LastMsg: msg.Text, LastMsgAt: msg.SentAt, UnreadCount: 0 };
              }
              return r;
            });
            setObj(prev => ({ ...prev, ListRoom: updateRoom }));
          }
        }
      }
    });

    hubProxy.on('updateInbox', msg => {
      const targetRoom = Obj?.ListRoom?.find(r => r.RoomId?.toString() === msg.RoomId?.toString());

      if (targetRoom && targetRoom.IsActive == '0') {
        return;
      }

      if (!targetRoom) {
        GetInbox();
        return;
      }

      const isOwnMessage = msg.Tkn === lgdata.Keys;
      const isCurrentlyViewing = msg.RoomId?.toString() === activeRoomId?.toString() && document.hasFocus();

      if (!isOwnMessage && !isCurrentlyViewing) {
        showDesktopNotification(msg);
        playNotificationSound();
      }

      setObj(prev => {
        const updatedList = prev.ListRoom.map(r =>
          r.RoomId?.toString() === msg.RoomId?.toString()
            ? { ...r, LastMsg: msg.Text, LastMsgAt: msg.SentAt, UnreadCount: r.RoomId?.toString() === activeRoomId?.toString() ? r.UnreadCount : (r.UnreadCount || 0) + 1 }
            : r
        ).sort((a, b) => new Date(b.LastMsgAt) - new Date(a.LastMsgAt));

        return { ...prev, ListRoom: updatedList };
      });
      // GetInbox();
    });

    return () => {
      hubProxy.off('receiveMessage');
      hubProxy.off('updateInbox');
    };
  }, [activeRoomId, Obj, chat]);

  useEffect(() => {
    if ('Notification' in window) {
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }

    if (Capacitor.isNativePlatform()) {
      registerPushNotifications();
    }

    // return () => {
    //   if (Capacitor.isNativePlatform()) {
    //     PushNotifications.removeAllListeners();
    //   }
    // };
  }, []);

  const registerPushNotifications = () => {
    addLog('1. Memulai cek izin...');
    let permStatus =  PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      addLog('2. Meminta izin pengguna...');
      permStatus =  PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      addLog('X. Izin ditolak pengguna.');
      console.log('Izin push notification ditolak.');
      return;
    }

    PushNotifications.addListener('registration',  apnsToken => {
      console.log('APNs Token:', apnsToken.value);
      addLog('5. Sukses dapat APNs: ' + apnsToken.value.substring(0, 10) + '...');
      try {
        addLog('6. Meminta FCM Token...');
        const result =  FCM.getToken();
        console.log('FCM Token Anda:', result.token);
        addLog('7. FCM didapat: ' + result.token.substring(0, 10) + '...');
        saveToken(result.token);
      } catch (err) {
        console.error('Gagal ambil FCM token:', err);
        addLog('X. Error ambil FCM: ' + err.message);
      }
    });

    PushNotifications.addListener('registrationError', error => {
      console.error('Gagal registrasi notif:', error);
      addLog('X. APNs Error: ' + JSON.stringify(error));
    });

    PushNotifications.addListener('pushNotificationActionPerformed', action => {
      const roomId = action.notification.data?.roomId;
      try {
         PushNotifications.removeAllDeliveredNotifications();
      } catch (err) {
        console.error('Gagal menghapus notifikasi:', err);
      }

      GetInbox();

      if (roomId) {
        pendingRoomId.current = roomId;
        if (Obj.ListRoom?.length > 0) {
          handleOpenChat(1, roomId);
        }
      }
    });

    App.addListener('appStateChange', ({ isActive }) => {
      if (isActive) {
        try {
          PushNotifications.removeAllDeliveredNotifications();
        } catch (err) {
          console.error('Gagal menghapus notifikasi saat resume:', err);
        }
        GetInbox();
      }
    });

    addLog('Izin diberikan. Memanggil APNs register...');
    PushNotifications.register();
    addLog('Perintah APNs register selesai dieksekusi.');

  };

  useEffect(() => {
    if (pendingRoomId.current && Obj.ListRoom?.length > 0) {
      handleOpenChat(1, pendingRoomId.current);
      pendingRoomId.current = null;
    }
  }, [Obj.ListRoom]);

  const saveToken = async fcmToken => {
    const payload = {
      ProsesId: 'SaveToken',
      UsTkn: lgdata.Keys,
      Tkn: fcmToken,
      UserId: lgdata.UserId
    };
    try {
      let temp = await axios({
        url: `${link}/ProsesChat`,
        method: 'POST',
        data: payload,
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      })
        .then(response => {
          console.log('Token FCM sukses disetorkan ke backend!');
        })
        .catch(err => {
          ISI.PopAlertFalcon('error', 'error', err.response.data.Message, '');
        });
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.response.data.Message, '');
    }
  };

  const showDesktopNotification = msg => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const shortText = msg.Text?.length > 60 ? msg.Text.substring(0, 60) + '...' : msg.Text;

      const options = {
        body: shortText,
        icon: msg.SenderAvatar || `https://ui-avatars.com/api/?name=${msg.SenderName}&background=6c757d&color=fff`,
        silent: true
      };

      const notification = new Notification(`${msg.SenderName}`, options);

      notification.onclick = () => {
        window.focus();
        if (msg.RoomId) {
          handleOpenChat(1, msg.RoomId);
        }
        notification.close();
      };
    }
  };

  const scrollToBottom = () => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'instant' });
    }
  };

  useEffect(() => {
    if (page === 1) {
      scrollToBottom();
    }
  }, [messages, activeRoomId]);

  const DoIsiData = data => {
    setObj(data);
    setChat(data?.Room);
    setMessages(data?.Room?.Msg);
    setActiveRoomId(data?.Room?.RoomId);
  };

  const GetAllUser = async () => {
    const cachedUser = localStorage.getItem('listUser');

    if (cachedUser) {
      setLsUser(JSON.parse(cachedUser).map(user => ({ ...user, isAddGroup: 0 })));
      return;
    }
    try {
      let temp = await axios({
        url: `${link}/GetAllUser`,
        method: 'GET',
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata?.UserTkn
        }
      })
        .then(response => {
          setLsUser(response.data.map(user => ({ ...user, isAddGroup: 0 })));
          localStorage.setItem('listUser', JSON.stringify(response.data));
        })
        .catch(err => {
          ISI.PopAlertFalcon('error', 'error', err.response?.data?.Message, '');
        });
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.response?.data?.Message, '');
    }
  };

  const GetInbox = async () => {
    try {
      let temp = await axios({
        url: `${link}/GetInbox?tkn=${lgdata?.Keys}`,
        method: 'GET',
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata?.UserTkn
        }
      })
        .then(response => {
          setObj(response.data);
        })
        .catch(err => {
          ISI.PopAlertFalcon('error', 'error', err.response?.data?.Message, '');
        });
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.response?.data?.Message, '');
    }
  };

  useEffect(() => {
    GetAllUser();
    GetInbox();
    // if (!CheckDev.isMobile) {
    //   setActiveRoomId('room-000');
    //   const activeRoom = dummyChats.find(i => i.chatRoomId == 'room-000');
    //   setChat(activeRoom);
    // }
  }, []);

  const handleNewChat = async item => {
    const roomData = {
      Type: 'P',
      Title: '',
      Tkn: lgdata.Keys,
      IP: lgdata.IPDSP
    };

    const myUserData = lsUser?.find(i => i.UserId === lgdata.UserId);
    const members = [];
    members.push(item);
    members.push(myUserData);

    const upobj = {
      ProsesId: 'CreateChat',
      UserId: lgdata.UserId,
      Data: roomData,
      ListMember: members,
      Page: 1
    };

    setObj(upobj);

    try {
      let temp = await axios({
        url: `${link}/ProsesChat`,
        method: 'POST',
        data: upobj,
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      })
        .then(response => {
          DoIsiData(response.data);
          setIsAdd(false);
          setIsProfile(false);

          handleOpenChat(1, response.data?.Data?.RoomId);
        })
        .catch(err => {
          ISI.PopAlertFalcon('error', 'error', err.response.data.Message, '');
        });
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.response.data.Message, '');
    }
  };

  const handleOpenChat = async (pageNumber, roomId) => {
    if (isIconTrash) {
      return;
    }
    if (pageNumber > 1 && isLastPage) {
      return;
    }

    const payload = {
      ProsesId: 'GetHistory',
      UserId: lgdata.UserId,
      Tkn: lgdata.Keys,
      Data: { RoomId: roomId, Tkn: lgdata?.Keys },
      Page: pageNumber,
      ListRoom: Obj.ListRoom
    };

    setObj(payload);

    try {
      let temp = await axios({
        url: `${link}/ProsesChat`,
        method: 'POST',
        data: payload,
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      })
        .then(response => {
          const result = response.data;
          const newMessages = result?.Data?.Msg || [];

          if (pageNumber === 1) {
            // setMessages(result?.Data?.Msg);
            // setActiveRoomId(roomId);
            DoIsiData(result);
            setPage(1);
            setIsLastPage(result.Data.IsLastPage);
            setTimeout(() => scrollToBottom(), 100);
          } else {
            if (newMessages.length > 0) {
              setMessages(prev => [...newMessages, ...prev]);
              setPage(pageNumber);
            }
            setIsLastPage(result.Data.IsLastPage);
          }

          // setIsLastPage(result.Data.IsLastPage);
          if (isProfile) {
            setIsProfile(true);
          } else {
            setIsProfile(false);
          }

          if (hubProxy) {
            hubProxy
              .invoke('JoinRoom', roomId.toString())
              .done(() => console.log('Successfully joined SignalR room: ' + roomId))
              .fail(err => console.error('SignalR Join Error: ' + err));
          }
        })
        .catch(err => {
          ISI.PopAlertFalcon('error', 'error', err.response.data.Message, '');
        });
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.response.data.Message, '');
    }
  };

  const handleSendMessage = async (uploadData, file) => {
    const hasText = message && message.trim() !== '';
    const hasUpload = uploadData && uploadData.FileUrl;
    if (!hasText && !hasUpload) return;

    const MAX_KARAKTER = 500;

    if (message.length > MAX_KARAKTER) {
      ISI.PopAlertFalcon('error', 'Peringatan', 'Pesan terlalu panjang!', '');
      return;
    }

    const payload = {
      ProsesId: 'SendMessage',
      UserId: lgdata.UserId,
      Tkn: lgdata.Keys,
      NewMsg: {
        RoomId: activeRoomId,
        UserId: lgdata.UserId,
        Tkn: lgdata.Keys,
        IP: lgdata.IPDSP,
        Text: message,
        FileUrl: uploadData?.FileUrl,
        FileType: file?.type,
        FileName: file?.name,
        SenderName: lgdata.UserName
      }
    };

    try {
      let temp = await axios({
        url: `${link}/ProsesChat`,
        method: 'POST',
        data: payload,
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      })
        .then(response => {
          // DoIsiData(response.data);
          setMessage('');
          setObj(response.data);

          const savedMsg = response?.data?.NewMsg;
          if (savedMsg?.ChatId) {
            setMessages(prev => {
              const isExist = prev.find(item => item.ChatId === savedMsg.ChatId);
              if (isExist) return prev;
              return [...prev, savedMsg];
            });
          }
        })
        .catch(err => {
          ISI.PopAlertFalcon('error', 'error', err.response.data.Message, '');
        });
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.response.data.Message, '');
    }
  };

  const handleKeyMessage = e => {
    const target = e.target;
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        return;
      }

      e.preventDefault();
      target.style.height = 'auto';

      if (message.trim() !== '') {
        handleSendMessage();
      }
    }
  };

  const ResetUnread = async roomId => {
    const payload = {
      ProsesId: 'ResetUnread',
      Data: { RoomId: roomId },
      UserId: lgdata.UserId,
      Tkn: lgdata.Keys
    };
    try {
      let temp = await axios({
        url: `${link}/ProsesChat`,
        method: 'POST',
        data: payload,
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      })
        .then(response => {})
        .catch(err => {
          ISI.PopAlertFalcon('error', 'error', err.response.data.Message, '');
        });
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.response.data.Message, '');
    }
  };

  const handleScroll = e => {
    const { scrollTop, scrollHeight } = e.currentTarget;
    if (scrollTop === 0 && !isLastPage) {
      const previousHeight = scrollHeight;

      handleOpenChat(page + 1, activeRoomId).then(() => {
        setTimeout(() => {
          const container = document.getElementById('center');
          if (container) {
            container.scrollTop = container.scrollHeight - previousHeight;
          }
        }, 50);
      });
    }
  };

  const handleEmojiClick = emojiData => {
    setMessage(prev => prev + emojiData.emoji);
  };

  const filteredUser = useMemo(() => {
    const lowKeyword = keyword?.toLowerCase();
    return lsUser?.filter(item => item.NIK !== lgdata?.NIK && (item.Name?.toLowerCase().includes(lowKeyword) || item.UserId?.toLowerCase().includes(lowKeyword)));
  }, [keyword, lsUser]);

  const availableAddMember = useMemo(() => {
    const existingMemberTkns = new Set(chat?.Members?.map(m => m.NIK));
    return filteredUser?.filter(user => !existingMemberTkns.has(user.NIK));
  }, [filteredUser]);

  const filteredInbox = useMemo(() => {
    const lowKeyword = keywordIbx?.toLowerCase();
    return !keywordIbx ? Obj?.ListRoom : Obj?.ListRoom?.filter(item => item.Title?.toLowerCase().includes(lowKeyword));
  }, [keywordIbx, Obj?.ListRoom]);

  const handleTextareaChange = e => {
    const target = e.target;
    setMessage(target.value);
    target.style.height = 'auto';
    target.style.height = `${Math.min(target.scrollHeight, 100)}px`;
  };

  const componentDecorator = (href, text, key) => {
    const cleanHref = href.replace(/^https?:\/\//, '').replace(/\/+$/, '');
    const cleanERP = ERP_URL.replace(/^https?:\/\//, '').replace(/\/+$/, '');
    const cleanMOBILE = MOBILE_URL.replace(/^https?:\/\//, '').replace(/\/+$/, '');
    const cleanIPOL = IPOL_URL.replace(/^https?:\/\//, '').replace(/\/+$/, '');

    const isErpUrl = cleanHref.startsWith(cleanERP);
    const isKeyUrl = cleanHref.startsWith(cleanMOBILE) || cleanHref.startsWith(cleanIPOL);

    let finalHref = href;

    if (isErpUrl) {
      try {
        const urlObj = new URL(href);
        const appid = urlObj.searchParams.get('appid');

        finalHref = appid ? `${IPOL_URL}login/LoginKeyErp/${lgdata.Keys}/${lgdata.IP}/${appid}` : `${href}${href.includes('?') ? '&' : '?'}key=${lgdata.Keys}`;
      } catch (e) {
        finalHref = href;
      }
    } else if (isKeyUrl) {
      finalHref = `${href}${href.includes('?') ? '&' : '?'}key=${lgdata.Keys}`;
    }

    // const isTargetUrl = cleanHref.startsWith(cleanERP) || cleanHref.startsWith(cleanMOBILE) || cleanHref.startsWith(cleanIPOL);

    // const finalHref = isTargetUrl
    //   ? `${href}${href.includes('?') ? '&' : '?'}key=${lgdata.Keys}`
    //   : href;

    return (
      <a href={finalHref} key={key} target="_blank" rel="noopener noreferrer" className="text-decoration-underline">
        {text}
      </a>
    );
  };

  const playNotificationSound = () => {
    const audio = new Audio(`/assets/audio/notif-chat.mp3`);

    audio.play().catch(err => {
      console.log('Audio gagal diputar otomatis karena kebijakan interaksi browser:', err);
    });
  };

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === 'document') {
      const isImageOrVideo = file.type.startsWith('image/') || file.type.startsWith('video/');
      if (isImageOrVideo) {
        ISI.PopAlertFalcon('error', 'Peringatan', 'Silakan gunakan menu Galeri untuk mengirim foto atau video.', '');
        e.target.value = null;
        return;
      }
    }

    if (file.size > 25000000) {
      ISI.PopAlertFalcon('error', 'error', 'Max Size File Upload 25mb', '');
      e.target.value = null;
      return;
    }

    const date = new Date();
    const formattedDate = format(date, 'yyyyMMddHHmmss');

    const formData = new FormData();
    formData.append('ID', 'ISIChat');
    formData.append('Kode', activeRoomId);
    formData.append('file', file);
    formData.append('IP', lgdata?.IP);
    formData.append('Usid', lgdata?.UserId);
    formData.append('Folder', 'ISIChat');
    formData.append('DocNo', `${file?.name}-${formattedDate}`);
    formData.append('Type', 'ISIChat');

    try {
      var temp = await axios({
        url: `${BASE_URL}api/FileUpload/UploadFile`,
        method: 'POST',
        data: formData,
        contentType: 'multipart/form-data',
        headers: {
          Keys: lgdata.UserTkn
        }
      });

      if (temp.data.Msg == '' || temp.data.Msg == null) {
        await handleSendMessage(temp.data, file);

        e.target.value = null;
      } else {
        ISI.PopAlertFalcon('Warning', 'Warning', temp.data.Msg, '');
        e.target.value = null;
      }
    } catch (error) {
      ISI.AlertException(error);
      e.target.value = null;
    }
  };

  const handleAddUser = data => {
    const isAlreadyAdded = Obj?.ListMember?.some(member => member.UserId === data.UserId);

    if (isAlreadyAdded) {
      if (Obj && Obj.ListMember) {
        Obj.ListMember = Obj?.ListMember?.filter(member => member.UserId !== data.UserId);
      }

      setLsUser(prev => prev.map(user => (user.UserId === data.UserId ? { ...user, isAddGroup: 0 } : user)));
    } else {
      Obj?.ListMember?.push(data);

      setLsUser(prev => prev.map(user => (user.UserId === data.UserId ? { ...user, isAddGroup: 1 } : user)));
    }
  };

  const resetAddGroup = () => {
    setIsGroup(false);
    setIsAddMember(false);

    if (Obj) {
      Obj.ListMember = [];
    }
    setObj({
      ...Obj,
      ListMember: []
    });

    setLsUser(prev => prev.map(user => ({ ...user, isAddGroup: 0 })));
  };

  const txtChange = e => {
    let val = e.target.value;
    let id = e.target.id;

    setObj({
      ...Obj,
      Data: {
        ...Obj?.Data,
        [id]: val
      }
    });
  };

  const handleNewGroup = async file => {
    const roomData = {
      Type: 'G',
      Title: Obj?.Data?.Title,
      Tkn: lgdata.Keys,
      IP: lgdata.IPDSP,
      Image: file?.FileUrl
    };

    const myUserData = lsUser?.find(i => i.UserId === lgdata.UserId);
    Obj?.ListMember.push(myUserData);

    const upobj = {
      ProsesId: 'CreateChat',
      UserId: lgdata.UserId,
      Data: roomData,
      ListMember: Obj?.ListMember,
      Page: 1
    };

    setObj(upobj);

    try {
      let temp = await axios({
        url: `${link}/ProsesChat`,
        method: 'POST',
        data: upobj,
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      })
        .then(response => {
          DoIsiData(response.data);
          setIsGroup(false);
          setIsProfile(false);
          setKeyword('');

          handleOpenChat(1, response.data?.Data?.RoomId);
        })
        .catch(err => {
          ISI.PopAlertFalcon('error', 'error', err.response.data.Message, '');
        });
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.response.data.Message, '');
    }
  };

  const getCustomAvatar = fullName => {
    if (!fullName) return '';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random&color=fff&rounded=true&bold=true`;
  };

  const handleDeleteRoom = async roomId => {
    const payload = {
      ProsesId: 'DeleteRoom',
      Data: { RoomId: roomId },
      UserId: lgdata.UserId,
      Tkn: lgdata.Keys
    };
    try {
      let temp = await axios({
        url: `${link}/ProsesChat`,
        method: 'POST',
        data: payload,
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      })
        .then(response => {
          const result = response.data;
          setIsDeleteRoom(false);
          setIsIconTrash(false);
          setDeleteRoomId('');
          DoIsiData(result);
        })
        .catch(err => {
          ISI.PopAlertFalcon('error', 'error', err.response.data.Message, '');
        });
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.response.data.Message, '');
    }
  };

  const handleDeleteChat = async roomId => {
    const payload = {
      ProsesId: 'DeleteChat',
      Data: { RoomId: roomId },
      UserId: lgdata.UserId,
      Tkn: lgdata.Keys
    };
    try {
      let temp = await axios({
        url: `${link}/ProsesChat`,
        method: 'POST',
        data: payload,
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      })
        .then(response => {
          const result = response.data;
          setIsDeleteChat(false);
          DoIsiData(result);
        })
        .catch(err => {
          ISI.PopAlertFalcon('error', 'error', err.response.data.Message, '');
        });
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.response.data.Message, '');
    }
  };

  const handleAddMember = async () => {
    const upobj = {
      ProsesId: 'AddMember',
      UserId: lgdata.UserId,
      Data: { RoomId: activeRoomId, Tkn: lgdata?.Keys },
      ListMember: Obj?.ListMember,
      Tkn: lgdata?.Keys
    };

    try {
      let temp = await axios({
        url: `${link}/ProsesChat`,
        method: 'POST',
        data: upobj,
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      })
        .then(response => {
          DoIsiData(response.data);
          resetAddGroup();
          setKeyword('');

          // setIsProfile(false);
        })
        .catch(err => {
          ISI.PopAlertFalcon('error', 'error', err.response.data.Message, '');
        });
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.response.data.Message, '');
    }
  };

  const handleLeaveGroup = async roomId => {
    const payload = {
      ProsesId: 'LeaveGroup',
      Data: { RoomId: roomId, Tkn: lgdata?.Keys },
      UserId: lgdata.UserId,
      Tkn: lgdata.Keys
    };
    try {
      let temp = await axios({
        url: `${link}/ProsesChat`,
        method: 'POST',
        data: payload,
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      })
        .then(response => {
          const result = response.data;
          setisLeaveGroup(false);
          setActiveRoomId('');
          setIsProfile(false);
          DoIsiData(result);
        })
        .catch(err => {
          ISI.PopAlertFalcon('error', 'error', err.response.data.Message, '');
        });
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.response.data.Message, '');
    }
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
      setPreviewFile(file);
    }
  };

  const handleSaveGroup = async () => {
    if (previewFile) {
      if (previewFile?.size > 10000000) {
        ISI.PopAlertFalcon('error', 'error', 'Max Size File Upload 10mb', '');
        setPreviewFile(null);
        setPreviewUrl(null);
        return;
      }

      const date = new Date();
      const formattedDate = format(date, 'yyyyMMddHHmmss');

      const formData = new FormData();
      formData.append('ID', 'ISIChat');
      formData.append('file', previewFile);
      formData.append('IP', lgdata?.IP);
      formData.append('Usid', lgdata?.UserId);
      formData.append('Folder', 'ISIChat');
      formData.append('DocNo', `${previewFile?.name}-${formattedDate}`);
      formData.append('Type', 'ISIChat');

      try {
        var temp = await axios({
          url: `${BASE_URL}api/FileUpload/UploadFile`,
          method: 'POST',
          data: formData,
          contentType: 'multipart/form-data',
          headers: {
            Keys: lgdata.UserTkn
          }
        });

        if (temp.data.Msg == '' || temp.data.Msg == null) {
          await handleNewGroup(temp.data);

          setPreviewFile(null);
          setPreviewUrl(null);
          setKeyword('');
        } else {
          ISI.PopAlertFalcon('Warning', 'Warning', temp.data.Msg, '');
          setPreviewFile(null);
          setPreviewUrl(null);
        }
      } catch (error) {
        ISI.AlertException(error);
        setPreviewFile(null);
        setPreviewUrl(null);
      }
    } else {
      handleNewGroup();
    }
  };

  const handleLongPressStart = roomId => {
    setIsIconTrash(false);
    setDeleteRoomId('');
    timerRef.current = setTimeout(() => {
      setIsIconTrash(true);
      setDeleteRoomId(roomId);
    }, 500);
  };

  const handleLongPressEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const imageMessages = messages?.filter(m => m.FileType?.startsWith('image/'));

  const imageDocuments = messages?.filter(m => m.FileUrl && !m.FileType?.startsWith('image/'));

  const openPreview = chatId => {
    const idx = imageMessages.findIndex(m => m.ChatId === chatId);
    if (idx !== -1) setPreviewIndex(idx);
  };

  function CustomToggle({ children, eventKey }) {
    const decoratedOnClick = useAccordionButton(eventKey);
    return (
      <div onClick={decoratedOnClick} className="d-flex align-items-center justify-content-between py-3 cursor-pointer">
        {children}
      </div>
    );
  }

  const handleDownload = async (url, filename) => {
    try {
      const response = await axios({
        url: `${link}/GetFile?url=${encodeURIComponent(url)}`,
        method: 'GET',
        responseType: 'blob',
        headers: {
          Keys: lgdata.UserTkn
        }
      });
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const blobUrl = window.URL.createObjectURL(blob);

      const lnk = document.createElement('a');
      lnk.href = blobUrl;
      lnk.setAttribute('download', filename || 'downloaded_file');
      document.body.appendChild(lnk);
      lnk.click();
      document.body.removeChild(lnk);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Download gagal:', err);
      window.open(url, '_blank');
    }
  };

  // const stripWaFormatting = (text = '') => {
  //   if (!text) return '';

  //   return text
  //     .replace(/<br\s*\/?>/gi, ' ')
  //     .replace(/(?<![\w])_\*([^\*\n]+)\*_(?![\w])/g, '$1')
  //     .replace(/(?<![\w])\*_([^_\n]+)_\*(?![\w])/g, '$1')
  //     .replace(/(?<![\w])\*([^\*\n]+)\*(?![\w])/g, '$1')
  //     .replace(/(?<![\w])_([^_\n]+)_(?![\w])/g, '$1')
  //     .replace(/(?<![\w])~([^~\n]+)~(?![\w])/g, '$1')
  //     .replace(/```([^`]+)```/g, '$1')
  //     .replace(/(?<![\w])`([^`\n]+)`(?![\w])/g, '$1')
  //     .replace(/```/g, '')
  //     .replace(/(?<![\w])[*_~`](?![\w])/g, '')
  //     .replace(/\s+/g, ' ')
  //     .trim();
  // }

  const stripWaFormatting = (text = '') => {
    if (!text) return '';

    return text
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/_\*([^\*\n]+)\*_/g, '$1')
      .replace(/\*_([^_\n]+)_\*/g, '$1')
      .replace(/\*([^\*\n]+)\*/g, '$1')
      .replace(/_([^_\n]+)_/g, '$1')
      .replace(/~([^~\n]+)~/g, '$1')
      .replace(/```([^`]+)```/g, '$1')
      .replace(/`([^`\n]+)`/g, '$1')
      .replace(/```/g, '')
      .replace(/[*_~`]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  useEffect(() => {
    const backHandler = App.addListener('backButton', () => {
      if (isProfile) {
        setIsProfile(false);
      } else if (activeRoomId) {
        setActiveRoomId('');
      } else {
        App.exitApp();
      }
    });
    return () => {
      backHandler.then(h => h.remove());
    };
  }, [activeRoomId, isProfile]);

  useEffect(() => {
    const handleClickOutside = event => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmoji(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = event => {
      if (attachRef.current && !attachRef.current.contains(event.target)) {
        setIsAttach(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <Card className="w-100 h-100">
        <Card.Body className="p-0 d-flex" style={{ height: self == top ? htab + 30 : htabe + 30 }}>
          {((CheckDev.isMobile && !activeRoomId) || !CheckDev.isMobile) && (
            <div id="list" className="d-flex flex-column gap-3 p-4 border-md-end border-md-300" style={{ flex: 1, maxWidth: activeRoomId && '23%', minWidth: '320px' }}>
              <div id="top" className="d-flex justify-content-end align-items-start">
                <div className="d-flex gap-3 gap-md-2">
                  {/* <div className="border border-300 rounded p-2 py-2 d-flex align-items-center custom-nav-item cursor-pointer">
                    <SvgIcon name={'more-horizontal'} size={16} />
                  </div> */}
                  {/* <div className="border border-300 rounded p-2 py-2 d-flex align-items-center custom-nav-item cursor-pointer">
                    <SvgIcon name={'video'} size={16} />
                  </div> */}
                  {isIconTrash && (
                    <div className="border border-300 rounded p-3 py-3 p-md-2 py-md-2 d-flex align-items-center custom-nav-item cursor-pointer" onClick={() => setIsDeleteRoom(!isDeleteRoom)}>
                      <SvgIcon name={'trash-01'} size={16} />
                    </div>
                  )}
                  <div className="border border-300 rounded p-3 py-3 p-md-2 py-md-2 d-flex align-items-center custom-nav-item cursor-pointer" onClick={() => setIsDebug(true)}>
                    <SvgIcon name={'zap'} size={16} />
                  </div>
                  <div className="border border-300 rounded p-3 py-3 p-md-2 py-md-2 d-flex align-items-center custom-nav-item cursor-pointer" onClick={() => setIsGroup(true)}>
                    <SvgIcon name={'users'} size={16} />
                  </div>
                  <div className="border border-300 rounded p-3 py-3 p-md-2 py-md-2 d-flex align-items-center custom-nav-item cursor-pointer" onClick={() => setIsAdd(true)}>
                    <SvgIcon name={'edit'} size={16} />
                  </div>
                </div>
              </div>
              <div id="search" className="d-flex gap-3 align-items-center justify-content-between">
                <div className="border border-300 rounded-2 d-flex align-items-center gap-2 w-100 ps-2">
                  <Row className="p-0 m-0 g-0 w-100">
                    <Col xs={1} style={{ width: 'fit-content' }}>
                      <SvgIcon name="search" size={14} className="text-dark" />
                    </Col>
                    <Col>
                      <IsiTxt
                        css="shadow-none border-0 py-0 my-0 ps-2 mb-n1 w-100 bg-transparent"
                        val={keywordIbx}
                        placeholder="Search"
                        // onfocus={() => {
                        //   keyword && setShowMenu(!showMenu);
                        // }}
                        onchange={e => {
                          setKeywordIbx(e.target.value);
                        }}
                      />
                    </Col>
                  </Row>
                </div>
              </div>
              <div id="chat-list" className="d-flex flex-column overflow-y-auto custom-scroll" style={{ height: self == top ? htab - 75 : htabe - 75 }}>
                {filteredInbox?.map(i => (
                  <div
                    className={`d-flex justify-content-between position-relative py-3 px-2 border-bottom border-300 custom-inbox cursor-pointer ${i?.RoomId == deleteRoomId && 'bg-400 rounded-3'} ${
                      (i?.RoomId == activeRoomId || i?.RoomId == deleteRoomId) && 'bg-200 rounded-3'
                    }`}
                    key={i?.RoomId}
                    onClick={() => handleOpenChat(1, i?.RoomId)}
                    onTouchStart={() => handleLongPressStart(i?.RoomId)}
                    onTouchEnd={handleLongPressEnd}
                    onMouseDown={() => handleLongPressStart(i?.RoomId)}
                    onMouseUp={handleLongPressEnd}
                    onMouseLeave={handleLongPressEnd}
                  >
                    <div className="d-flex gap-3 align-items-center">
                      <Avatar src={i?.Image ? i.Image : i?.Title == 'System Admin' ? avatarAdmin : getCustomAvatar(i.Title)} size="2xl" />
                      <div className="d-flex flex-column gap-2">
                        <h5 className="fw-normal fs-10 m-0">{i?.Title}</h5>
                        <p className="fw-light m-0 fs-11 text-truncate" style={{ maxWidth: '210px' }}>
                          {stripWaFormatting(i?.LastMsg)}
                        </p>
                      </div>
                    </div>
                    <p className="fs-11 fw-light m-0 position-absolute d-flex flex-column gap-1 align-items-end end-0 me-3" style={{}}>
                      {formatChatTime(i?.LastMsgAt)}
                      {i?.UnreadCount > 0 && (
                        <div className="bg-danger rounded-circle d-flex justify-content-center align-items-center" style={{ width: '18px', height: '18px' }}>
                          <small className="m-0 text-white">{i?.UnreadCount}</small>
                        </div>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeRoomId && chat && (
            <>
              {((CheckDev.isMobile && !isProfile) || !CheckDev.isMobile) && (
                <div id="chat" className={`d-flex flex-column ${isProfile && 'd-md-none d-lg-block'}`} style={{ flex: 2 }}>
                  <div id="top" className="d-flex justify-content-between align-items-start p-4" style={{ boxShadow: '0px 4px 4px 0px rgba(205, 205, 205, 0.25)', maxHeight: '90px' }}>
                    <div className="d-flex gap-3 align-items-center cursor-pointer pe-2" onClick={() => setIsProfile(true)}>
                      <Avatar
                        src={chat?.Image ? chat.Image : chat?.Title == 'System Admin' ? avatarAdmin : getCustomAvatar(chat.Title)}
                        size={`${CheckDev.isMobile ? '2xl' : '3xl'}`}
                        className="h-fit pb-2"
                      />
                      <div className="d-flex flex-column gap-1">
                        <h5 className="fw-bold fs-10 fs-md-9 m-0">{chat?.Title}</h5>
                        <p className="fw-light m-0 fs-11 fs-md-10">{chat?.Dept}</p>
                      </div>
                    </div>
                    <div className="d-flex gap-1">
                      <div className="border border-300 rounded p-3 py-3 p-md-2 py-md-2 d-flex align-items-center custom-nav-item cursor-pointer" onClick={() => setIsDeleteChat(!isDeleteChat)}>
                        <SvgIcon name={'trash-01'} size={16} />
                      </div>
                      {chat?.Title != 'System Admin' && (
                        <>
                          {chat?.Type == 'G' && chat?.IsActive == '1' && (
                            <div className="border border-300 rounded p-3 py-3 p-md-2 py-md-2 d-flex align-items-center custom-nav-item cursor-pointer" onClick={() => setisLeaveGroup(!isLeaveGroup)}>
                              <SvgIcon name={'logout-01'} size={16} />
                            </div>
                          )}
                          {/* <div className="border border-300 rounded p-2 py-2 d-flex align-items-center custom-nav-item cursor-pointer">
                            <SvgIcon name={'video'} size={16} />
                          </div>
                          <div className="border border-300 rounded p-2 py-2 d-flex align-items-center custom-nav-item cursor-pointer">
                            <SvgIcon name={'information-circle-contained'} size={16} />
                          </div> */}
                        </>
                      )}
                      {CheckDev.isMobile && (
                        <>
                          <div
                            className="border border-300 d-none d-lg-flex rounded p-3 py-3 p-md-2 py-md-2 d-flex align-items-center custom-nav-item cursor-pointer"
                            onClick={() => {
                              setActiveRoomId();
                            }}
                          >
                            <SvgIcon name={'x'} size={16} />
                          </div>
                          <div
                            className="border border-300 rounded d-lg-none p-3 py-3 p-md-2 py-md-2 d-flex align-items-center custom-nav-item cursor-pointer"
                            onClick={() => {
                              setActiveRoomId();
                            }}
                          >
                            <SvgIcon name={'chevron-left'} size={16} />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div id="center" onScroll={handleScroll} className="d-flex flex-column gap-4 p-4 custom-scroll overflow-y-auto" style={{ flex: 1, height: self == top ? htab - 103 : htabe - 103 }}>
                    {messages?.map(m => (
                      <div key={m.ChatId} className={`d-flex gap-1 ${m?.SenderName == lgdata?.UserName && 'justify-content-end'}`}>
                        {m.SenderName != lgdata?.UserName && chat.Type == 'G' && <Avatar src={m?.SenderAvatar ? m?.SenderAvatar : getCustomAvatar(m.SenderName)} size="l" className={'mt-2'} />}
                        <div className={`d-flex flex-column gap-1 w-fit ${m.SenderName == lgdata?.UserName && 'align-self-end align-items-end'}`}>
                          <p
                            className={`p-2 rounded-3 w-fit bg-200 fs-10 m-0 d-flex flex-column gap-1 ${m.SenderName != lgdata?.UserName && 'bg-primary-subtle'}`}
                            style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                          >
                            {m.SenderName != lgdata?.UserName && chat.Type == 'G' && <span className="fs-12 fw-medium">{m.SenderName != lgdata?.UserName && m.SenderName}</span>}
                            {m?.FileUrl ? (
                              <>
                                {m.FileType?.startsWith('image/') ? (
                                  <img
                                    src={m.FileUrl}
                                    alt={m.FileName}
                                    className="rounded-2 border cursor-pointer"
                                    style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover' }}
                                    onClick={() => openPreview(m.ChatId)}
                                  />
                                ) : m.FileType?.startsWith('video/') ? (
                                  <video src={m.FileUrl} controls className="rounded-2 border" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                                ) : (
                                  <div className="d-flex align-items-center gap-2 p-1 root-download cursor-pointer">
                                    <span className="fs-9">📄</span>
                                    <div className="d-flex flex-column overflow-hidden">
                                      <a
                                        rel="noreferrer"
                                        onClick={() => handleDownload(m.FileUrl, m.FileName)}
                                        className="fw-medium text-primary text-decoration-underline text-truncate"
                                        style={{ maxWidth: '180px' }}
                                      >
                                        {m.FileName}
                                      </a>
                                    </div>
                                  </div>
                                )}
                              </>
                            ) : (
                              <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{formatText(m.Text, componentDecorator)}</div>
                            )}
                          </p>
                          <small className="m-0 text-600">{formatChatTime(m.SentAt)}</small>
                        </div>
                      </div>
                    ))}
                    <div ref={endRef}></div>
                  </div>
                  {chat?.Title !== 'System Admin' && chat?.IsActive == '1' && (
                    <div id="bottom" className="d-flex justify-content-between align-items-end p-3 border-top gap-2" style={{ boxShadow: '0px -4px 4px 0px rgba(205, 205, 205, 0.25)' }}>
                      <div className="d-flex gap-1 position-relative">
                        <input
                          type="file"
                          id="file-input-doc"
                          // accept=".pdf, .sql, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt, .zip, .rar, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation, text/plain, application/zip, application/vnd.rar"
                          accept=".pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation"
                          ref={fileInputRef}
                          className="d-none"
                          onChange={e => handleFileChange(e, 'document')}
                          onClick={e => {
                            e.target.value = null;
                          }}
                        />
                        <input
                          type="file"
                          id="file-input-media"
                          accept="image/*,video/*"
                          ref={imageInputRef}
                          className="d-none"
                          onChange={e => handleFileChange(e, 'image')}
                          onClick={e => {
                            e.target.value = null;
                          }}
                        />
                        <input
                          type="file"
                          id="file-input"
                          accept="image/*"
                          ref={cameraInputRef}
                          capture="environment"
                          className="d-none"
                          onChange={e => handleFileChange(e, 'camera')}
                          onClick={e => {
                            e.target.value = null;
                          }}
                        />
                        <div className="border border-400 rounded p-3 py-2 d-flex align-items-center custom-nav-item cursor-pointer" style={{ height: '42px' }} onClick={() => setIsAttach(!isAttach)}>
                          <SvgIcon name={'more-vertical'} size={16} />
                        </div>
                        {isAttach && (
                          <div ref={attachRef} className="position-absolute d-flex flex-column gap-1 bottom-0 mb-10 p-2 bg-100 rounded-2">
                            <div className="border border-400 rounded p-2 py-2 d-flex align-items-center custom-nav-item cursor-pointer" onClick={() => fileInputRef.current.click()}>
                              <SvgIcon name={'paperclip-01'} size={16} />
                            </div>
                            <div className="border border-400 rounded p-2 py-2 d-flex align-items-center custom-nav-item cursor-pointer" onClick={() => imageInputRef.current.click()}>
                              <SvgIcon name={'image'} size={16} />
                            </div>
                            <div className="border border-400 rounded p-2 py-2 d-flex align-items-center custom-nav-item cursor-pointer" onClick={() => cameraInputRef.current.click()}>
                              <SvgIcon name={'camera-01'} size={16} />
                            </div>
                            {/* <div className="border d-xl-none border-400 rounded p-2 py-2 d-flex align-items-center custom-nav-item cursor-pointer">
                              <SvgIcon name={'mic'} size={16} />
                            </div> */}
                            <div className="border d-xl-none border-400 rounded p-2 py-2 d-flex align-items-center custom-nav-item cursor-pointer" onClick={() => setShowEmoji(!showEmoji)}>
                              <SvgIcon name={'smiley-happy'} size={16} />
                            </div>
                          </div>
                        )}
                        {/* <div className="border border-400 d-none d-xl-flex rounded p-3 py-2 d-flex align-items-center custom-nav-item cursor-pointer" style={{ height: '42px' }}>
                          <SvgIcon name={'mic'} size={16} />
                        </div> */}
                      </div>
                      {/* <div className="border d-none border-400 rounded p-3 py-2 d-flex align-items-center custom-nav-item cursor-pointer" style={{ height: '42px' }} onClick={() => setShowEmoji(!showEmoji)}>
                        <SvgIcon name={'smiley-happy'} size={16} />
                      </div> */}
                      <div className="border border-400 rounded-2 px-2 py-1 bg-200 w-100">
                        <Row className="p-0 m-0 g-0 w-100">
                          <Col>
                            <IsiTxt
                              row={1}
                              css="shadow-none border-0 p-0 mb-n1 w-100 bg-transparent"
                              placeholder="Type a message..."
                              val={message}
                              onchange={handleTextareaChange}
                              onkeydown={handleKeyMessage}
                              style={{ resize: 'none', maxHeight: '32px', overflowY: 'auto' }}
                            />
                          </Col>
                        </Row>
                      </div>
                      <div
                        className="border d-none d-xl-flex border-400 rounded p-3 py-3 d-flex align-items-center custom-nav-item cursor-pointer"
                        style={{ height: '42px' }}
                        onClick={() => setShowEmoji(!showEmoji)}
                      >
                        <SvgIcon name={'smiley-happy'} size={16} />
                      </div>
                      {showEmoji && (
                        <div ref={emojiRef} className="position-absolute bottom-0 end-0 mb-11">
                          <EmojiPicker
                            onEmojiClick={handleEmojiClick}
                            theme={isDark ? 'dark' : 'light'}
                            previewConfig={{ showPreview: false }}
                            searchDisabled={true}
                            width={CheckDev.isMobile ? 270 : 400}
                            height={CheckDev.isMobile ? 279 : 318}
                          />
                        </div>
                      )}
                      <Button
                        variant="primary"
                        className="d-flex gap-2 align-items-center gap-1 rounded-2 py-1 px-4 fs-11 font-sans-serif fw-normal"
                        size="sm"
                        style={{ height: '42px' }}
                        onClick={handleSendMessage}
                      >
                        <SvgIcon name={'send'} size={16} />
                        Send
                      </Button>
                    </div>
                  )}
                </div>
              )}
              {isProfile && (
                <div id="profile" className="d-flex flex-column gap-4 p-4 border-md-start border-md-300 w-md-100 w-lg-25 custom-profile" style={{ flex: 1, minWidth: '290px' }}>
                  <div className="ms-auto mb-n5">
                    <div className="d-flex gap-2">
                      <div className="border border-300 d-none d-lg-flex rounded p-3 py-3 p-md-2 py-md-2 d-flex align-items-center custom-nav-item cursor-pointer" onClick={() => setIsProfile(false)}>
                        <SvgIcon name={'x'} size={16} />
                      </div>
                      <div className="border border-300 d-lg-none rounded p-3 py-3 p-md-2 py-md-2 d-flex align-items-center custom-nav-item cursor-pointer" onClick={() => setIsProfile(false)}>
                        <SvgIcon name={'chevron-left'} size={16} />
                      </div>
                    </div>
                  </div>
                  <div className="d-flex flex-column gap-4 align-items-center py-4 border-bottom border-300">
                    <Avatar src={chat?.Image ? chat?.Image : chat?.Title == 'System Admin' ? avatarAdmin : getCustomAvatar(chat.Title)} size="4xl" />
                    <div className="d-flex flex-column gap-2 align-items-center">
                      <h5 className="fw-bold fs-7 m-0">{chat.Title}</h5>
                      <p className="fw-light m-0 fs-10">{chat.Dept}</p>
                    </div>
                  </div>
                  {chat?.Type == 'G' && (
                    <div className="d-flex justify-content-between align-items-center">
                      <p className="m-0 fs-10 fw-bold">Members</p>
                      {chat?.IsActive == '1' && (
                        <div className="border border-300 rounded p-3 py-3 p-md-2 py-md-2 d-flex align-items-center custom-nav-item cursor-pointer" onClick={() => setIsAddMember(true)}>
                          <SvgIcon name={'user-profile-add-02'} size={16} />
                        </div>
                      )}
                    </div>
                  )}
                  <div className="d-flex flex-column gap-2 overflow-y-auto custom-scroll" style={{ height: self == top ? htab - 123 : htabe - 123 }}>
                    {chat?.Type == 'G' && (
                      <>
                        <div className="d-flex flex-column gap-3 overflow-y-auto custom-scroll" style={{ maxHeight: self == top ? htab - 650 : htabe - 650 }}>
                          {chat.Members?.sort((a, b) => (a.NIK === lgdata?.NIK ? -1 : b.NIK === lgdata?.NIK ? 1 : 0)).map((i, idx) => (
                            <>
                              <div key={idx} className="d-flex align-items-center gap-2">
                                <Avatar src={i?.Image ? i.Image : getCustomAvatar(i.Title)} size={`${CheckDev.isMobile ? 'xl' : '2xl'}`} className="h-fit" />
                                <div className="d-flex flex-column">
                                  <h5 className="fw-normal fs-11 fs-md-10 m-0">{i.NIK == lgdata?.NIK ? 'You' : i?.Name}</h5>
                                  <p className="fw-light m-0 fs-11">{i?.Dept}</p>
                                </div>
                              </div>
                            </>
                          ))}
                        </div>
                      </>
                    )}
                    {/* <div className="d-flex align-items-center justify-content-between py-3">
                      <p className="m-0 fs-10">Chat Setting</p>
                      <SvgIcon name={'chevron-down'} size={16} />
                    </div> */}
                    {/* <div className="d-flex align-items-center justify-content-between py-3">
                      <p className="m-0 fs-10">Privacy & Help</p>
                      <SvgIcon name={'chevron-down'} size={16} />
                    </div> */}
                    <div>
                      <Accordion>
                        <Accordion.Item eventKey="0" className="border-0 bg-transparent">
                          <CustomToggle eventKey="0">
                            <p className="m-0 fs-10">Shared Photos</p>
                            <SvgIcon name={'chevron-down'} size={16} />
                          </CustomToggle>
                          <Accordion.Collapse eventKey="0">
                            <div className="d-flex flex-column gap-3 my-2">
                              {imageMessages.map((i, idx) => (
                                <div key={idx} className="d-flex align-items-center justify-content-between">
                                  <div className="d-flex align-items-center gap-3">
                                    <img src={i.FileUrl} width={'50'} height={'50'} />
                                    <p title={i.FileName} style={{ maxWidth: '120px' }} className="m-0 fs-10 text-truncate">
                                      {i.FileName}
                                    </p>
                                  </div>
                                  <div onClick={() => handleDownload(i.FileUrl, i.FileName)} className="rounded p-2 py-2 bg-200 text-primary d-flex align-items-center cursor-pointer">
                                    <SvgIcon name={'download'} size={16} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </Accordion.Collapse>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1" className="border-0 bg-transparent">
                          <CustomToggle eventKey="1">
                            <p className="m-0 fs-10">Shared Files</p>
                            <SvgIcon name={'chevron-down'} size={16} />
                          </CustomToggle>
                          <Accordion.Collapse eventKey="1">
                            <div className="d-flex flex-column gap-3 my-2">
                              {imageDocuments.map((i, idx) => (
                                <div key={idx} className="d-flex align-items-center justify-content-between">
                                  <div className="d-flex align-items-center gap-3">
                                    <span className="fs-9">📄</span>
                                    <p title={i.FileName} style={{ maxWidth: '180px' }} className="m-0 fs-10 text-truncate">
                                      {i.FileName}
                                    </p>
                                  </div>
                                  <div onClick={() => handleDownload(i.FileUrl, i.FileName)} className="rounded p-2 py-2 bg-200 text-primary d-flex align-items-center cursor-pointer">
                                    <SvgIcon name={'download'} size={16} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </Accordion.Collapse>
                        </Accordion.Item>
                      </Accordion>
                    </div>
                  </div>
                  {/* <div className="d-flex flex-column gap-2 overflow-y-auto custom-scroll" style={{ maxHeight: self == top ? htab - 244 : htabe - 244 }}>
                    <div className="d-flex align-items-center justify-content-between py-3">
                      <p className="m-0 fs-10">Chat Setting</p>
                      <SvgIcon name={'chevron-down'} size={16} />
                    </div>
                    <div className="d-flex align-items-center justify-content-between py-3">
                      <p className="m-0 fs-10">Privacy & Help</p>
                      <SvgIcon name={'chevron-down'} size={16} />
                    </div>
                    <div>
                      <div className="d-flex align-items-center justify-content-between py-3">
                        <p className="m-0 fs-10">Shared Photos</p>
                        <SvgIcon name={'chevron-down'} size={16} />
                      </div>
                      <div className="d-flex flex-column gap-3 my-2">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center gap-3">
                            <img src={img} width={'50'} height={'50'} />
                            <p className="m-0 fs-10">plastic-bopp.png</p>
                          </div>
                          <div className="rounded p-2 py-2 bg-200 text-primary d-flex align-items-center">
                            <SvgIcon name={'download'} size={16} />
                          </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center gap-3">
                            <img src={img} width={'50'} height={'50'} />
                            <p className="m-0 fs-10">plastic-bottle.png</p>
                          </div>
                          <div className="rounded p-2 py-2 bg-200 text-primary d-flex align-items-center">
                            <SvgIcon name={'download'} size={16} />
                          </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center gap-3">
                            <img src={img} width={'50'} height={'50'} />
                            <p className="m-0 fs-10">waste-plastic-bottle.png</p>
                          </div>
                          <div className="rounded p-2 py-2 bg-200 text-primary d-flex align-items-center">
                            <SvgIcon name={'download'} size={16} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between py-3">
                      <p className="m-0 fs-10">Shared Files</p>
                      <SvgIcon name={'chevron-down'} size={16} />
                    </div>
                  </div> */}
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      <Modal show={isAdd} backdrop="static" keyboard={false} onHide={() => setIsAdd(false)} size="md" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header className="px-4 border-0 w-100">
          <div className="d-flex flex-column gap-3 w-100">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="fs-8 fw-semibold m-0">New Chat</h6>
              <SvgIcon
                name={'x'}
                size={20}
                className="cursor-pointer"
                onClick={() => {
                  setIsAdd(false), setKeyword('');
                }}
              />
            </div>
            <IsiTxt label={'Search UserID'} placeholder={''} val={keyword} onchange={e => setKeyword(e.target.value)} css={'rounded-2 py-2'} />
          </div>
        </Modal.Header>
        <Modal.Body
          className="px-4 pt-0 d-flex flex-column overflow-y-auto custom-scroll mt-n3"
          style={CheckDev.isMobile ? { minHeight: '13rem', height: self == top ? htab - 270 : htabe - 270 } : { height: self == top ? htab - 335 : htabe - 335 }}
        >
          {filteredUser?.map((i, idx) => (
            <div key={idx} className="d-flex align-items-center justify-content-between border-bottom border-300 py-2 py-md-3 cursor-pointer" onClick={() => handleNewChat(i)}>
              <div className="d-flex gap-4 align-items-center">
                <Avatar src={i.Link} size="3xl" />
                <h5 className="fw-bold fs-10 fs-md-9 m-0">{i.Name}</h5>
              </div>
              {/* <Button variant="primary" className="rounded-3 d-flex align-items-center gap-2 p-2 p-md-3 py-2 py-md-3 font-sans-serif fw-semibold" onClick={() => handleNewChat(i)}>
                <SvgIcon name={'message-circle'} size={17} />
              </Button> */}
            </div>
          ))}
        </Modal.Body>
      </Modal>

      <Modal show={isGroup} backdrop="static" keyboard={false} onHide={() => setIsGroup(false)} size="md" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header className="px-4 border-0 w-100">
          <div className="d-flex flex-column gap-3 w-100">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="fs-8 fw-semibold m-0">New Group</h6>
              <SvgIcon
                name={'x'}
                size={20}
                className="cursor-pointer"
                onClick={() => {
                  resetAddGroup(), setKeyword(''), setPreviewUrl('');
                }}
              />
            </div>
            <Row className="g-0 d-flex gap-3 align-items-center w-100">
              <Col className="col-1 cursor-pointer" style={{ width: 'fit-content' }}>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  className="d-none"
                  ref={iconInputRef}
                  onChange={handleImageChange}
                  onClick={e => {
                    e.target.value = null;
                  }}
                />
                <div
                  className={`d-flex flex-column align-items-center gap-3 justify-content-center bg-300 rounded-circle cursor-pinter overflow-hidden ${!previewUrl ? 'p-3' : ''}`}
                  style={{ width: '100px', height: '100px' }}
                  onClick={() => iconInputRef.current.click()}
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="Group Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <>
                      <SvgIcon name={'camera-01'} size={'24'} />
                      <p className="m-0 fs-10 text-center lh-sm mt-2">Add Icon Group</p>
                    </>
                  )}
                </div>
              </Col>
              <Col className="w-100">
                <IsiTxt label={'Group Name'} placeholder={'Input Group Name'} id={'Title'} val={Obj?.Data?.Title} onchange={txtChange} css={'rounded-2 py-2 w-100'} />
              </Col>
            </Row>

            <IsiTxt label={'Add User'} placeholder={''} val={keyword} onchange={e => setKeyword(e.target.value)} css={'rounded-2 py-2'} />
            <div className="d-flex gap-2 flex-wrap overflow-y-auto mb-2" style={{ maxHeight: '70px', scrollbarWidth: 'thin' }}>
              {Obj?.ListMember?.map(i => (
                <div className="bg-primary-light text-primary fs-10 m-0 px-3 py-1 rounded-pill w-fit d-flex align-items-center gap-2">
                  <p className="m-0">{i.Name}</p>
                  <SvgIcon name={'x'} size={17} className="cursor-pointer" onClick={() => handleAddUser(i)} />
                </div>
              ))}
            </div>
          </div>
        </Modal.Header>
        <Modal.Body
          className="px-4 pt-0 d-flex flex-column overflow-y-auto custom-scroll mt-n3"
          style={CheckDev.isMobile ? { minHeight: '9rem', maxHeight: self == top ? htab - 395 : htabe - 395 } : { maxHeight: self == top ? htab - 470 : htabe - 470 }}
        >
          {filteredUser?.map((i, idx) => (
            <div key={idx} className="d-flex align-items-center justify-content-between border-bottom border-300 py-2 py-md-3">
              <div className="d-flex gap-4 align-items-center">
                <Avatar src={i.Link} size="3xl" />
                <h5 className="fw-bold fs-10 fs-md-9 m-0">{i.Name}</h5>
              </div>
              {i.isAddGroup === 0 ? (
                <Button variant="primary" className="rounded-3 d-flex align-items-center gap-2 p-2 p-md-3 py-2 py-md-3 font-sans-serif fw-semibold" onClick={() => handleAddUser(i)}>
                  <SvgIcon name={'plus'} size={17} />
                </Button>
              ) : (
                <Button variant="primary" className="rounded-3 d-flex align-items-center gap-2 p-2 p-md-3 py-2 py-md-3 font-sans-serif fw-semibold" onClick={() => handleAddUser(i)}>
                  <SvgIcon name={'x'} size={17} />
                </Button>
              )}
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer className="px-3 pb-3 pt-2 border-0">
          <Button variant="primary" disabled={Obj?.ListMember?.length == 0 || Obj?.Data?.Title == ''} className="rounded-3 px-3 py-2 font-sans-serif fw-normal fs-10" onClick={handleSaveGroup}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={isAddMember} backdrop="static" keyboard={false} onHide={() => setIsAddMember(false)} size="md" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header className="px-4 border-0 w-100">
          <div className="d-flex flex-column gap-3 w-100">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="fs-8 fw-semibold m-0">Add Member</h6>
              <SvgIcon
                name={'x'}
                size={20}
                className="cursor-pointer"
                onClick={() => {
                  resetAddGroup(), setKeyword('');
                }}
              />
            </div>
            <IsiTxt label={'Add User'} placeholder={''} val={keyword} onchange={e => setKeyword(e.target.value)} css={'rounded-2 py-2'} />
            <div className="d-flex gap-2 flex-wrap overflow-y-auto mb-2" style={{ maxHeight: '70px', scrollbarWidth: 'thin' }}>
              {Obj?.ListMember?.map(i => (
                <div className="bg-primary-light text-primary fs-10 m-0 px-3 py-1 rounded-pill w-fit d-flex align-items-center gap-2">
                  <p className="m-0">{i.Name}</p>
                  <SvgIcon name={'x'} size={17} className="cursor-pointer" onClick={() => handleAddUser(i)} />
                </div>
              ))}
            </div>
          </div>
        </Modal.Header>
        <Modal.Body
          className="px-4 pt-0 d-flex flex-column overflow-y-auto custom-scroll mt-n3"
          style={CheckDev.isMobile ? { minHeight: '12rem', maxHeight: self == top ? htab - 395 : htabe - 395 } : { maxHeight: self == top ? htab - 470 : htabe - 470 }}
        >
          {availableAddMember?.map((i, idx) => (
            <div key={idx} className="d-flex align-items-center justify-content-between border-bottom border-300 py-2 py-md-3">
              <div className="d-flex gap-4 align-items-center">
                <Avatar src={i.Link} size="3xl" />
                <h5 className="fw-bold fs-10 fs-md-9 m-0">{i.Name}</h5>
              </div>
              {i.isAddGroup === 0 ? (
                <Button variant="primary" className="rounded-3 d-flex align-items-center gap-2 p-2 p-md-3 py-2 py-md-3 font-sans-serif fw-semibold" onClick={() => handleAddUser(i)}>
                  <SvgIcon name={'plus'} size={17} />
                </Button>
              ) : (
                <Button variant="primary" className="rounded-3 d-flex align-items-center gap-2 p-2 p-md-3 py-2 py-md-3 font-sans-serif fw-semibold" onClick={() => handleAddUser(i)}>
                  <SvgIcon name={'x'} size={17} />
                </Button>
              )}
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer className="px-3 pb-3 pt-2 border-0">
          <Button disabled={Obj?.ListMember?.length == 0} variant="primary" className="rounded-3 px-3 py-2 font-sans-serif fw-normal fs-10" onClick={handleAddMember}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={isDeleteRoom} size="md" onHide={() => setIsDeleteRoom(false)} centered>
        <Modal.Body className="d-flex flex-column justify-content-center align-items-center gap-3">
          <h5 className="fw-semibold fs-8">Are you sure want to Delete Room?</h5>
          <div className="d-flex gap-3">
            <Button className="px-8 fs-10 py-1 fw-normal" variant="primary" onClick={() => handleDeleteRoom(deleteRoomId)}>
              Yes
            </Button>
            <Button className="px-8 fs-10 py-1 fw-normal" variant="danger" onClick={() => setIsDeleteRoom(false)}>
              No
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={isDeleteChat} size="md" onHide={() => setIsDeleteChat(false)} centered>
        <Modal.Body className="d-flex flex-column justify-content-center align-items-center gap-3">
          <h5 className="fw-semibold fs-8">Are you sure want to delete history chat?</h5>
          <div className="d-flex gap-3">
            <Button className="px-8 fs-10 py-1 fw-normal" variant="primary" onClick={() => handleDeleteChat(activeRoomId)}>
              Yes
            </Button>
            <Button className="px-8 fs-10 py-1 fw-normal" variant="danger" onClick={() => setIsDeleteChat(false)}>
              No
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={isLeaveGroup} size="md" onHide={() => setisLeaveGroup(false)} centered>
        <Modal.Body className="d-flex flex-column justify-content-center align-items-center gap-3">
          <h5 className="fw-semibold fs-8">Are you sure want to Leave?</h5>
          <div className="d-flex gap-3">
            <Button className="px-8 fs-10 py-1 fw-normal" variant="primary" onClick={() => handleLeaveGroup(activeRoomId)}>
              Yes
            </Button>
            <Button className="px-8 fs-10 py-1 fw-normal" variant="danger" onClick={() => setisLeaveGroup(false)}>
              No
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={previewIndex !== null} onHide={() => setPreviewIndex(null)} centered contentClassName="bg-transparent border-0 shadow-none" fullscreen>
        <Button
          variant="light"
          className="rounded p-2 py-2 text-primary d-flex align-items-center cursor-pointer position-absolute m-3 m-lg-5 end-0"
          onClick={() => {
            setPreviewIndex(null);
          }}
          style={{ zIndex: 10 }}
        >
          <SvgIcon name={'x'} size={24} />
        </Button>
        <Modal.Body className="p-0 position-relative">
          {previewIndex !== null && (
            <Carousel activeIndex={previewIndex} onSelect={idx => setPreviewIndex(idx)} interval={null} indicators={imageMessages.length > 1} controls={imageMessages.length > 1}>
              {imageMessages.map(img => (
                <Carousel.Item key={img.ChatId}>
                  <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                    <img
                      src={img.FileUrl}
                      alt={img.FileName}
                      style={{
                        maxWidth: '60vw',
                        maxHeight: '70vh',
                        width: 'auto',
                        height: 'auto',
                        objectFit: 'contain'
                      }}
                      className="rounded-2 shadow"
                    />
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={isDebug} size="md" onHide={() => setIsDebug(false)} centered>
        <Modal.Body className='fs-11'>
          <strong>[Debug Push Notif]</strong>
          {debugLogs.map((log, index) => (
            <div key={index} className="fs-11">{log}</div>
          ))}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Chat;
