
export const Video = () => {
    return (
        <video
            src="/videos/homepage.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover"
        />
    );
};
