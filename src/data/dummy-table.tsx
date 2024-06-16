export interface Payment {
    id: string;
    name: string,
    parent: string,
    status: "active" | "inactive";
    address?: string,
    createdAt: string
};
export const data: Payment[] = [
    {
        id: "m5gr84i9",
        name: "name",
        parent: "parent",
        status: "active",
        createdAt: "2024-05-10",
    },
    {
        id: "3u1reuv4",
        name: "name",
        parent: "parent",
        status: "active",
        createdAt: "2024-05-10",
    },
    {
        id: "derv1ws0",
        name: "name",
        parent: "parent",
        status: "inactive",
        createdAt: "2024-05-10",
    },
    {
        id: "5kma53ae",
        name: "name",
        parent: "parent",
        status: "active",
        createdAt: "2024-05-10",
    },
    {
        id: "bhqecj4p",
        name: "name",
        parent: "parent",
        status: "inactive",
        createdAt: "2024-05-10",
    },
];