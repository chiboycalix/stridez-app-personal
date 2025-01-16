export const formatDate = (dateString: string): string => {
    const now = new Date();
    const postDate = new Date(dateString);
    const differenceInMs = now.getTime() - postDate.getTime();

    const msInDay = 24 * 60 * 60 * 1000;
    const msInMonth = msInDay * 30;
    const msInYear = msInDay * 365;

    const daysAgo = Math.floor(differenceInMs / msInDay);
    const monthsAgo = Math.floor(differenceInMs / msInMonth);
    const yearsAgo = Math.floor(differenceInMs / msInYear);

    if (yearsAgo > 0) {
        return yearsAgo === 1 ? "1 year ago" : `${yearsAgo} years ago`;
    } else if (monthsAgo > 0) {
        return monthsAgo === 1 ? "1 month ago" : `${monthsAgo} months ago`;
    } else if (daysAgo > 0) {
        return daysAgo === 1 ? "1 day ago" : `${daysAgo} days ago`;
    } else {
        return "Today";
    }
};

export const formatFileSize = (size: number): string => {
    if (size < 1024) return `${size} Bytes`;
    else if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    else if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    else return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};
