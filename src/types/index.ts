export type Announcement={id:string;title:string;summary:string;date:string;important?:boolean}
export type Song={id:string;number:number;title:string;celebration:string;season:string;lyrics:string;chords?:string}
export type Prayer={id:string;title:string;category:'Oraciones diarias'|'Novenas'|'Adoración'|'Santos patronos';body:string}
export type Saint={id:string;name:string;description:string;image:string;sourceUrl?:string}
export type EventItem={id:string;title:string;start:string;end?:string;category:string;location:string;description:string}
