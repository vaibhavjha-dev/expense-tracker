export type AICommand =
    | {
        action: "add_transaction";
        data: {
            amount: number;
            description: string;
            category: string;
            type: "income" | "expense";
            date?: string;
        };
    }
    | {
        action: "chat";
        message: string;
    };
