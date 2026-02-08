// 'use client'

// import {
//   Modal,
//   ModalContent,
//   ModalHeader,
//   Spinner,
//   ModalBody,
//   Switch,
//   Select,
//   SelectItem,
//   Input,
//   ModalFooter,
//   Button,
// } from '@heroui/react'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { Role } from '@prisma/client'
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
// import { useTranslations } from 'next-intl'
// import { useEffect, useState } from 'react'
// import { Controller, useForm } from 'react-hook-form'

// import type { UserCreateInput, UserUpdateInput } from '../user.schema'
// import type { ImageWithPreview } from '@/components/ui/ImageDropzone'

// import { getUser, createUser, updateUser } from '../user.action'
// import { userUpdateSchema, userCreateSchema } from '../user.schema'
// import { useUserStore } from '../user.store'

// import { ImageDropzone } from '@/components/ui/ImageDropzone'
// import { SectionLabel } from '@/components/ui/SectionHeader'
// import { useResolveImageUpload } from '@/hooks/useResolveImageUpload'

// const DEFAULT_VALUES = {
//   email: '',
//   password: '',
//   name: '',
//   image: '',
//   isActive: true,
//   role: Role.CUSTOMER,
// }

// export const UserForm = () => {
//   const translate = useTranslations('Dashboard.UserForm')
//   const translateCommon = useTranslations('Common')
//   const queryClient = useQueryClient()
//   const { isUserOpen, onOpenUserChange, userId, setState } = useUserStore()

//   const [previewFiles, setPreviewFiles] = useState<ImageWithPreview[]>([])
//   const [oldImage, setOldImage] = useState<string | null>(null)
//   const { resolveImagePath, isUploading } = useResolveImageUpload({
//     oldImage,
//     previewFiles,
//   })

//   const QUERY_KEY = {
//     DASHBOARD: ['dashboard', 'users', 'card'],
//     USER: ['dashboard', 'user', userId],
//     USERS: ['dashboard', 'users', 'pagination'],
//   }

//   type UserInput = UserCreateInput | UserUpdateInput
//   const userSchema = userId ? userUpdateSchema : userCreateSchema

//   const {
//     control,
//     reset,
//     handleSubmit,
//     setValue,
//     formState: { errors, isDirty },
//   } = useForm<UserInput>({
//     resolver: zodResolver(userSchema),
//     defaultValues: DEFAULT_VALUES,
//   })

//   const { data: user, isLoading: isLoadingUser } = useQuery({
//     queryKey: QUERY_KEY.USER,
//     queryFn: () => getUser(userId!),
//     enabled: !!userId && isUserOpen,
//   })

//   useEffect(() => {
//     if (userId && !isLoadingUser && user) {
//       reset(
//         { ...user, name: user?.name! },
//         {
//           keepDirty: false,
//           keepTouched: false,
//         },
//       )
//       setOldImage(user.image)
//     }
//   }, [isLoadingUser, reset, user, userId])

//   const onRefetch = async () => {
//     Promise.all([
//       queryClient.invalidateQueries({
//         queryKey: QUERY_KEY.DASHBOARD,
//       }),
//       queryClient.invalidateQueries({
//         queryKey: QUERY_KEY.USER,
//       }),
//       queryClient.invalidateQueries({
//         queryKey: QUERY_KEY.USERS,
//       }),
//     ])

//     onClose()
//   }

//   const { mutate: mutateCreateUser, isPending: isPendingCreateUser } =
//     useMutation({
//       mutationFn: createUser,
//       onSuccess: onRefetch,
//     })

//   const { mutate: mutateUpdateUser, isPending: isPendingUpdateUser } =
//     useMutation({
//       mutationFn: updateUser,
//       onSuccess: onRefetch,
//     })

//   const isPending =
//     isPendingCreateUser || isLoadingUser || isPendingUpdateUser || isUploading
//   const headerLable = userId ? translate('editTitle') : translate('addTitle')

//   const onFilesChange = (files: ImageWithPreview[]) => {
//     setPreviewFiles(files)

//     setValue(
//       'image',
//       files.length ? translate('imageChangedStatus') : (oldImage ?? ''),
//       {
//         shouldDirty: true,
//         shouldTouch: true,
//       },
//     )
//   }

//   const onSubmit = async (data: UserInput) => {
//     const imagePath = await resolveImagePath()

//     const payload = {
//       ...data,
//       image: imagePath,
//     }

//     if (userId) {
//       mutateUpdateUser(payload as UserUpdateInput)
//     } else {
//       mutateCreateUser(payload as UserCreateInput)
//     }
//   }

//   const onClose = () => {
//     setPreviewFiles([])
//     setOldImage(null)

//     queryClient.removeQueries({
//       queryKey: QUERY_KEY.USER,
//     })
//     reset(DEFAULT_VALUES)
//     setState({ userId: null })
//     onOpenUserChange()
//   }

//   return (
//     <Modal
//       hideCloseButton
//       isDismissable={false}
//       isOpen={isUserOpen}
//       scrollBehavior='inside'
//       size='xl'
//       onOpenChange={onOpenUserChange}
//     >
//       <ModalContent>
//         <ModalHeader className='flex flex-col gap-1'>{headerLable}</ModalHeader>

//         {isPending && <Spinner label={translateCommon('loading')} />}

//         {!isPending && (
//           <ModalBody>
//             <ImageDropzone onFilesChange={onFilesChange} />

//             <SectionLabel>{translate('licenseHeading')}</SectionLabel>
//             <Controller
//               control={control}
//               name='isActive'
//               render={({ field: { value, onChange, ...field } }) => (
//                 <Switch {...field} isSelected={value} onValueChange={onChange}>
//                   {translate('activeLabel')}
//                 </Switch>
//               )}
//             />
//             <Controller
//               control={control}
//               name='role'
//               render={({ field: { value, onChange, ...field } }) => (
//                 <Select
//                   {...field}
//                   errorMessage={errors.role?.message}
//                   isInvalid={!!errors.role}
//                   label={translate('roleLabel')}
//                   selectedKeys={value ? [value] : []}
//                   variant='bordered'
//                   onSelectionChange={(keys) => {
//                     const selected = Array.from(keys)[0] as Role

//                     onChange(selected)
//                   }}
//                 >
//                   {Object.values(Role).map((role) => (
//                     <SelectItem key={role}>
//                       {role === 'ADMIN'
//                         ? translate('roleAdmin')
//                         : translate('roleUser')}
//                     </SelectItem>
//                   ))}
//                 </Select>
//               )}
//             />

//             <SectionLabel>{translate('infoHeading')}</SectionLabel>
//             <Controller
//               control={control}
//               name='image'
//               render={({ field: { value, ...field } }) => (
//                 <Input
//                   {...field}
//                   isDisabled
//                   errorMessage={errors.image?.message}
//                   isInvalid={!!errors.image}
//                   label={translate('urlLabel')}
//                   value={value ?? ''}
//                   variant='bordered'
//                 />
//               )}
//             />
//             <Controller
//               control={control}
//               name='name'
//               render={({ field: { value, ...field } }) => (
//                 <Input
//                   {...field}
//                   errorMessage={errors.name?.message}
//                   isInvalid={!!errors.name}
//                   label={translate('nameLabel')}
//                   value={value ?? ''}
//                   variant='bordered'
//                 />
//               )}
//             />
//             <Controller
//               control={control}
//               name='email'
//               render={({ field: { value, ...field } }) => (
//                 <Input
//                   {...field}
//                   errorMessage={errors.email?.message}
//                   isInvalid={!!errors.email}
//                   label={translate('emailLabel')}
//                   value={value ?? ''}
//                   variant='bordered'
//                 />
//               )}
//             />
//             <Controller
//               control={control}
//               name='password'
//               render={({ field: { value, ...field } }) => (
//                 <Input
//                   {...field}
//                   errorMessage={errors.password?.message}
//                   isInvalid={!!errors.password}
//                   label={
//                     userId
//                       ? translate('passwordChangeLabel')
//                       : translate('passwordLabel')
//                   }
//                   type='password'
//                   value={value ?? ''}
//                   variant='bordered'
//                 />
//               )}
//             />
//           </ModalBody>
//         )}
//         <ModalFooter>
//           <Button isDisabled={isPending} variant='faded' onPress={onClose}>
//             {translateCommon('cancel')}
//           </Button>
//           <Button
//             className='text-secondary'
//             color='primary'
//             isDisabled={isPending || !isDirty}
//             onClick={handleSubmit(onSubmit)}
//           >
//             {isPending ? translateCommon('saving') : translateCommon('save')}
//           </Button>
//         </ModalFooter>
//       </ModalContent>
//     </Modal>
//   )
// }
