import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/auth/entities/user.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductImage } from './product-image.entity';

@Entity({ name: 'products' })
export class Product {

    @ApiProperty({
        example: '29fcf150-5d4b-4473-b87c-f9735a29c398',
        description: 'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'T-shirt Testo',
        description: 'Product Title',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    title: string;

    @ApiProperty({
        example: 0,
        description: 'Product price',
    })
    @Column('float', {
        default: 0
    })
    price: number;

    @ApiProperty({
        example: 'lorem',
        description: 'Product descripction',
        default: null
    })
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @ApiProperty({
        example: 't_shirt_testo',
        description: 'Product slug for SEO',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    slug: string;

    @ApiProperty({
        example: 10,
        description: 'Product stock',
        default: 0
    })
    @Column('int', {
        default: 0
    })
    stock: number;

    @ApiProperty({
        example: ['M', 'XL'],
        description: 'Product sizes',
    })
    @Column('text', {
        array: true
    })
    sizes: string[];

    @ApiProperty({
        example: 'women',
        description: 'Product gender',
    })
    @Column('text')
    gender: string;

    @ApiProperty()
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[];

    @ApiProperty()
    @OneToMany(() => ProductImage, productImage => productImage.product, { cascade: true, eager: true })
    images?: ProductImage[];

    @ManyToOne(() => User, user => user.product, {
        eager: true
    })
    user: User;

    @BeforeInsert()
    checkSlugInsert() {
        this.slug = this.title.toLowerCase().replace(/ /g, '_').replace(/'/g, '');
    }

    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.title.toLowerCase().replace(/ /g, '_').replace(/'/g, '');
    }

}
