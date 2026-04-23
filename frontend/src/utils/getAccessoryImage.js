export const getAccessoryImage = (accessory) => {
    if (accessory?.image_url) return accessory.image_url;
    if (!accessory) return 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=600'; // Default auto parts

    const name = accessory.name.toLowerCase();
    const category = accessory.category;

    if (category === 'interior') {
        if (name.includes('mat')) return 'https://images.unsplash.com/photo-1600705722908-bab1e619cd8e?auto=format&fit=crop&q=80&w=600';
        if (name.includes('seat')) return 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=600';
        if (name.includes('wheel') || name.includes('steering')) return 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?auto=format&fit=crop&q=80&w=600';
        return 'https://images.unsplash.com/photo-1550524514-ce52eebbb7e7?auto=format&fit=crop&q=80&w=600';
    }
    
    if (category === 'exterior') {
        if (name.includes('alloy') || name.includes('rim')) return 'https://images.unsplash.com/photo-1596489379203-b0e6df298de3?auto=format&fit=crop&q=80&w=600';
        if (name.includes('spoiler') || name.includes('wing')) return 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=600';
        if (name.includes('cover')) return 'https://images.unsplash.com/photo-1543465077-db45d34b88a5?auto=format&fit=crop&q=80&w=600';
        return 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=600';
    }
    
    if (category === 'spare_parts') {
        if (name.includes('brake') || name.includes('pad')) return 'https://images.unsplash.com/photo-1600706432502-77a0e2e32729?auto=format&fit=crop&q=80&w=600';
        if (name.includes('filter')) return 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?auto=format&fit=crop&q=80&w=600';
        if (name.includes('battery')) return 'https://images.unsplash.com/photo-1616422285623-14fb779148d4?auto=format&fit=crop&q=80&w=600';
        return 'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&q=80&w=600';
    }

    if (category === 'merchandise') {
        if (name.includes('shirt') || name.includes('apparel')) return 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600';
        if (name.includes('cap') || name.includes('hat')) return 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=600';
        if (name.includes('mug')) return 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=600';
        return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600';
    }

    return 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=600';
};
