const AvatarUpload = ({ user }) => {
  const userName = user?.fullName?.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "U";

  const currentImage = user?.profileImage || null;

  return (
    <div className="relative group shrink-0">
      <div className="relative h-24 w-24 rounded-2xl border-4 border-white bg-primary shadow-lg overflow-hidden">
        {currentImage ? (
          <img src={currentImage} alt="Avatar" className="h-full w-full object-cover" />
        ) : (
          <span className="text-white text-2xl font-bold flex items-center justify-center h-full w-full">
            {userName}{" "}
          </span>
        )}
      </div>
    </div>
  );
};

export default AvatarUpload;
