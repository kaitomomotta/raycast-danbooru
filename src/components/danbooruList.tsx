import { Form, ActionPanel, Action, showToast, Detail, List, Grid, getPreferenceValues } from "@raycast/api";
import { useState, useEffect } from "react";
import fetch from 'node-fetch'; // Import node-fetch
import { DanbooruListProps, PostDetailsProps } from "../types/types";
import { ListActions } from "./listActions";

export default function DanbooruList(props: DanbooruListProps) {
    const [posts, setPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    async function fetchPosts() {
        const preferences = getPreferenceValues();
        const login = preferences.username
        const apiKey = preferences.apiKey;
        const postsUrl = props.sfw ? `https://danbooru.donmai.us/posts.json?login=${login}&api_key=${apiKey}&tags=${props.tag1}+${props.tag2}+rating%3Ag&limit=${props.numberOfPosts}`
            : `https://danbooru.donmai.us/posts.json?login=${login}&api_key=${apiKey}&tags=${props.tag1}+${props.tag2}&limit=${props.numberOfPosts}`;

        try {
            const response = await fetch(postsUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const posts: any[] = await response.json() as any[];
            setPosts(posts);
        } catch (error) {
            if (error instanceof Error) {
                showToast({ title: "Error", message: error.message + ". Did you correctly set up your API Key ?" });
            } else {
                showToast({ title: "Error", message: "An unknown error occurred" });
            }
        }
        setIsLoading(false);
    }

    useEffect(() => {
        async function fetchData() {
            await fetchPosts();
        }
        fetchData();
    }, [props.tag1, props.tag2, props.numberOfPosts]);

    return (
        <Grid isLoading={isLoading}>
            {!isLoading && posts.map((post, index) => {
                const postUrl = `https://danbooru.donmai.us/posts/${post.id}`;
                const postDetails: PostDetailsProps = {
                    post: {
                        id: post.id,
                        file_url: post.file_url,
                        tag_string: post.tag_string_general,
                        rating: post.rating,
                        created_at: post.created_at,
                        artist: post.tag_string_artist,
                        copyright: post.tag_string_copyright,
                        character: post.tag_string_character
                    }
                }
                return (
                    <Grid.Item
                        key={index}
                        title={post.tag_string || post.id.toString()}
                        content={post.preview_file_url} // smaller, more compressed version of the file_url
                        actions={<ListActions {...postDetails} />}
                    />
                )
            })}
        </Grid>
    )
}