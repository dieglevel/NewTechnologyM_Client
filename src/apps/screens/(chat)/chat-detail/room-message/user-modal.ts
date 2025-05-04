const showUserInfo = (
    user: { name?: string; avatar?: string },
    setSelectedUser: (user: { name: string; avatar: string; status?: string; phone?: string } | null) => void,
    setShowUserInfoModal: (show: boolean) => void
  ) => {
    setSelectedUser({
      name: user.name || "-",
      avatar: user.avatar || "",
      status: user.name === "Tôi" ? "Đang hoạt động" : "Offline",
      phone: user.name === "Tôi" ? "+84 123 456 789" : "+84 987 654 321",
    });
    setShowUserInfoModal(true);
  };
  
  const closeUserInfoModal = (setShowUserInfoModal: (show: boolean) => void, setSelectedUser: (user: { name: string; avatar: string; status?: string; phone?: string } | null) => void) => {
    setShowUserInfoModal(false);
    setSelectedUser(null);
  };
  
  export { showUserInfo, closeUserInfoModal };