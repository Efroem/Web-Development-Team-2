﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using StarterKit.Models;

#nullable disable

namespace StarterKit.Migrations
{
    [DbContext(typeof(DatabaseContext))]
    partial class DatabaseContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "8.0.4");

            modelBuilder.Entity("StarterKit.Models.Admin", b =>
                {
                    b.Property<int>("AdminId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("AdminId");

                    b.HasIndex("UserName")
                        .IsUnique();

                    b.ToTable("Admin");

                    b.HasData(
                        new
                        {
                            AdminId = 1,
                            Email = "admin1@example.com",
                            Password = "^�H��(qQ��o��)'s`=\rj���*�rB�",
                            UserName = "admin1"
                        },
                        new
                        {
                            AdminId = 2,
                            Email = "admin2@example.com",
                            Password = "\\N@6��G��Ae=j_��a%0�QU��\\",
                            UserName = "admin2"
                        },
                        new
                        {
                            AdminId = 3,
                            Email = "admin3@example.com",
                            Password = "�j\\��f������x�s+2��D�o���",
                            UserName = "admin3"
                        },
                        new
                        {
                            AdminId = 4,
                            Email = "admin4@example.com",
                            Password = "�].��g��Պ��t��?��^�T��`aǳ",
                            UserName = "admin4"
                        },
                        new
                        {
                            AdminId = 5,
                            Email = "admin5@example.com",
                            Password = "E�=���:�-����gd����bF��80]�",
                            UserName = "admin5"
                        });
                });

            modelBuilder.Entity("StarterKit.Models.Customer", b =>
                {
                    b.Property<int>("CustomerId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Email")
                        .HasColumnType("TEXT");

                    b.Property<string>("FirstName")
                        .HasColumnType("TEXT");

                    b.Property<string>("LastName")
                        .HasColumnType("TEXT");

                    b.HasKey("CustomerId");

                    b.ToTable("Customer");
                });

            modelBuilder.Entity("StarterKit.Models.Reservation", b =>
                {
                    b.Property<int>("ReservationId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("AmountOfTickets")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("CustomerId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("TheatreShowDateId")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("Used")
                        .HasColumnType("INTEGER");

                    b.HasKey("ReservationId");

                    b.HasIndex("CustomerId");

                    b.HasIndex("TheatreShowDateId");

                    b.ToTable("Reservation");
                });

            modelBuilder.Entity("StarterKit.Models.TheatreShow", b =>
                {
                    b.Property<int>("TheatreShowId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Description")
                        .HasColumnType("TEXT");

                    b.Property<double>("Price")
                        .HasColumnType("REAL");

                    b.Property<string>("Title")
                        .HasColumnType("TEXT");

                    b.Property<int?>("VenueId")
                        .HasColumnType("INTEGER");

                    b.HasKey("TheatreShowId");

                    b.HasIndex("VenueId");

                    b.ToTable("TheatreShow");
                });

            modelBuilder.Entity("StarterKit.Models.TheatreShowDate", b =>
                {
                    b.Property<int>("TheatreShowDateId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("DateAndTime")
                        .HasColumnType("TEXT");

                    b.Property<int?>("TheatreShowId")
                        .HasColumnType("INTEGER");

                    b.HasKey("TheatreShowDateId");

                    b.HasIndex("TheatreShowId");

                    b.ToTable("TheatreShowDate");
                });

            modelBuilder.Entity("StarterKit.Models.Venue", b =>
                {
                    b.Property<int>("VenueId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("Capacity")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.HasKey("VenueId");

                    b.ToTable("Venue");
                });

            modelBuilder.Entity("StarterKit.Models.Reservation", b =>
                {
                    b.HasOne("StarterKit.Models.Customer", "Customer")
                        .WithMany("Reservations")
                        .HasForeignKey("CustomerId");

                    b.HasOne("StarterKit.Models.TheatreShowDate", "TheatreShowDate")
                        .WithMany("Reservations")
                        .HasForeignKey("TheatreShowDateId");

                    b.Navigation("Customer");

                    b.Navigation("TheatreShowDate");
                });

            modelBuilder.Entity("StarterKit.Models.TheatreShow", b =>
                {
                    b.HasOne("StarterKit.Models.Venue", "Venue")
                        .WithMany("TheatreShows")
                        .HasForeignKey("VenueId");

                    b.Navigation("Venue");
                });

            modelBuilder.Entity("StarterKit.Models.TheatreShowDate", b =>
                {
                    b.HasOne("StarterKit.Models.TheatreShow", "TheatreShow")
                        .WithMany("theatreShowDates")
                        .HasForeignKey("TheatreShowId");

                    b.Navigation("TheatreShow");
                });

            modelBuilder.Entity("StarterKit.Models.Customer", b =>
                {
                    b.Navigation("Reservations");
                });

            modelBuilder.Entity("StarterKit.Models.TheatreShow", b =>
                {
                    b.Navigation("theatreShowDates");
                });

            modelBuilder.Entity("StarterKit.Models.TheatreShowDate", b =>
                {
                    b.Navigation("Reservations");
                });

            modelBuilder.Entity("StarterKit.Models.Venue", b =>
                {
                    b.Navigation("TheatreShows");
                });
#pragma warning restore 612, 618
        }
    }
}