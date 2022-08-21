import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({name:'first_name'})
    firstName:string;
    
    @Column({name:'last_name'})
    lastName:string;

    @Column({unique:true})
    username:string;
    
    @Column({unique:true})
    email:string;

    @Column()
    password:string;

}