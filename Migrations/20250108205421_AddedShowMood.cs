using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StarterKit.Migrations
{
    /// <inheritdoc />
    public partial class AddedShowMood : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reservation_TheatreShowDate_TheatreShowDateId",
                table: "Reservation");

            migrationBuilder.DropForeignKey(
                name: "FK_TheatreShow_Venue_VenueId",
                table: "TheatreShow");

            migrationBuilder.DropForeignKey(
                name: "FK_TheatreShowDate_TheatreShow_TheatreShowId",
                table: "TheatreShowDate");

            migrationBuilder.DropIndex(
                name: "IX_TheatreShowDate_TheatreShowId",
                table: "TheatreShowDate");

            migrationBuilder.AlterColumn<int>(
                name: "TheatreShowId",
                table: "TheatreShowDate",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "VenueId",
                table: "TheatreShow",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ShowMood",
                table: "TheatreShow",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "TheatreShowDateId",
                table: "Reservation",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Reservation_TheatreShowDate_TheatreShowDateId",
                table: "Reservation",
                column: "TheatreShowDateId",
                principalTable: "TheatreShowDate",
                principalColumn: "TheatreShowDateId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TheatreShow_Venue_VenueId",
                table: "TheatreShow",
                column: "VenueId",
                principalTable: "Venue",
                principalColumn: "VenueId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reservation_TheatreShowDate_TheatreShowDateId",
                table: "Reservation");

            migrationBuilder.DropForeignKey(
                name: "FK_TheatreShow_Venue_VenueId",
                table: "TheatreShow");

            migrationBuilder.DropColumn(
                name: "ShowMood",
                table: "TheatreShow");

            migrationBuilder.AlterColumn<int>(
                name: "TheatreShowId",
                table: "TheatreShowDate",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AlterColumn<int>(
                name: "VenueId",
                table: "TheatreShow",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AlterColumn<int>(
                name: "TheatreShowDateId",
                table: "Reservation",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.CreateIndex(
                name: "IX_TheatreShowDate_TheatreShowId",
                table: "TheatreShowDate",
                column: "TheatreShowId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reservation_TheatreShowDate_TheatreShowDateId",
                table: "Reservation",
                column: "TheatreShowDateId",
                principalTable: "TheatreShowDate",
                principalColumn: "TheatreShowDateId");

            migrationBuilder.AddForeignKey(
                name: "FK_TheatreShow_Venue_VenueId",
                table: "TheatreShow",
                column: "VenueId",
                principalTable: "Venue",
                principalColumn: "VenueId");

            migrationBuilder.AddForeignKey(
                name: "FK_TheatreShowDate_TheatreShow_TheatreShowId",
                table: "TheatreShowDate",
                column: "TheatreShowId",
                principalTable: "TheatreShow",
                principalColumn: "TheatreShowId");
        }
    }
}
