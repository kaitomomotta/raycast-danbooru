type DanbooruListProps = {
    tag1: string;
    tag2: string;
    sfw: boolean;
    numberOfPosts: string;
}

interface PostDetailsProps {
    post: {
        id: number;
        file_url: string;
        tag_string: string;
        rating: string;
        created_at: string;
        artist: string;
        copyright: string;
        character: string;
    };
}

export type { DanbooruListProps, PostDetailsProps };