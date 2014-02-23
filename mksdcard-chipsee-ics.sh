#!/bin/bash

EXPECTED_ARGS=1

echo ""
echo "###### Android ICS 4.0.3 prebuilt image"
echo "###### For Chipsee Panda Expansion board"
echo "###### Based on Linaro android release 12.03"
echo "###### www.chipsee.com"
echo "###### 2013.05"
echo ""

echo "All data on "$1" now will be destroyed! Continue? [y/n]"
read ans
if ! [ $ans == 'y' ]
then
	exit
fi

echo "[Unmounting all existing partitions on the device ]"

umount $1*

echo "[Partitioning $1...]"

DRIVE=$1
dd if=/dev/zero of=$DRIVE bs=1024 count=1024 &>/dev/null
	 
SIZE=`fdisk -l $DRIVE | grep Disk | awk '{print $5}'`
	 
echo DISK SIZE - $SIZE bytes
 
CYLINDERS=`echo $SIZE/255/63/512 | bc`
 
echo CYLINDERS - $CYLINDERS
{
echo ,9,0x0C,*
echo ,66,L,-
echo ,32,L,-
echo ,-,E,-
echo ,66,L,-
echo ,,,-
} | sfdisk -D -H 255 -S 63 -C $CYLINDERS $DRIVE &> /dev/null

echo "[Making filesystems...]"

mkfs.vfat -F 32 -n boot "$1"1 &> /dev/null
mkfs.ext4 -L system "$1"2 &> /dev/null
mkfs.ext4 -L cache "$1"3 &> /dev/null
mkfs.ext4 -L userdata "$1"5 &> /dev/null
mkfs.vfat -F 32 -n sdcard "$1"6 &> /dev/null

echo "[Copying files...]"

echo "[Boot partition...]"
mount "$1"1 /mnt
cp boot/MLO /mnt/MLO
cp boot/u-boot.img /mnt/u-boot.img
cp boot/uImage /mnt/uImage
cp boot/uInitrd /mnt/uInitrd
cp boot/boot.scr /mnt/boot.scr
sync
umount "$1"1

echo "[System partition...]"
mount "$1"2 /mnt
cp system/* /mnt -a
sync
umount "$1"2

echo "[Userdata partition...]"
mount "$1"5 /mnt
cp userdata/* /mnt -a
sync
umount "$1"5

echo "[Sdcard partition...]"
mount "$1"6 /mnt
cp sdcard/* /mnt -a &> /dev/null
sync
umount "$1"6

echo "[Done]"
